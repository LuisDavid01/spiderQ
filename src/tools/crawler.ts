import { z } from 'zod'
import type { Pages, ToolFn } from '../../types'
import { encode } from '@toon-format/toon'
import { parseHTML } from 'linkedom'
import { logErrorLocal } from '../utils/logs'

export const crawlerToolDefinition = {
	name: 'crawler',
	parameters: z
		.object({
			url: z
				.string()
				.describe(
					'use this url to crawl'
				),
		})
		.describe('this tool crawls a webpage recursively and only takes ONE URL as parameter, returns a list of all the links the tool could find.'),
}

type Args = z.infer<typeof crawlerToolDefinition.parameters>

export const crawler: ToolFn<Args, string> = async ({
	toolArgs,
	userMessage,
}) => {
	const baseUrl = toolArgs.url
	// busca recursivamente todas las paginas
	const resp = await crawlPage(baseUrl, baseUrl, {})
	const respJson = JSON.stringify(resp)

	// probamos el nuevo encoding TOON 
	return encode(respJson)
}

/*
 * Todo: logear errores en db o archivo log local
 *
 *
 *
*/
async function crawlPage(baseURL: string, currentURL: string, pages: Pages) {
	const baseUrlObj = new URL(baseURL)
	const currUrlObj = new URL(currentURL)
	// si la pagina esta en otro dominio no la contamos
	if (baseUrlObj.hostname != currUrlObj.hostname) {
		return pages
	}

	// contamos las veces que visitamos una pagina
	const normalizedCurrentUrl = normalizeURL(currentURL)
	if (pages[normalizedCurrentUrl]) {
		pages[normalizedCurrentUrl].indexing++
		return pages
	}

	pages[normalizedCurrentUrl] = {
		indexing: 1,
		method: 'GET',
	}


	try {
		const resp = await fetch(currentURL)
		// si la pagina no es accesible o da error la saltamos
		if (resp.status > 399) {
			return pages
		}
		// si la pagina no es un html la saltamos
		const contentType = resp.headers.get('content-type')
		if (!contentType || !contentType.includes("text/html")) {
			return pages

		}


		const htmlBody = await resp.text()
		// obtenemos las url de la pagina actual
		const nextUrls = await urlFromHTML(htmlBody, baseURL)

		for (const nextUrl of nextUrls) {
			// por cada pagina buscamos las url recursivamente
			pages = await crawlPage(baseURL, nextUrl, pages)
			delay(Math.random() * (3243 - 569) + 569)
		}
	} catch (err) {
		if (err instanceof Error) {
		} else {
		}
	}
	// retornamos el objeto con todas las url encontradas
	return pages
}

// Extrae los hipervinculos de un cuerpo HTML
export async function urlFromHTML(htmlBody: string, baseURL: string) {
	const urls = []
	const { document } = parseHTML(htmlBody)
	const links = document.querySelectorAll('a')
	for (const link of links) {
		// validamos si es  una url relativa

		if (link.href.slice(0, 1) === '/') {
			try {
				const urlObj = new URL(`${baseURL}${link.href}`)
				urls.push(urlObj.href)
			} catch (err) {
				if (err instanceof Error) {
					await logErrorLocal(`Error parsing url ${err.message}, stack trace:\n ${err.stack?.split('\n').slice(0, 5)}`)
				} else {
					await logErrorLocal(`Unknown error parsing relative url`)
				}
			}
		} else {
			// agregamos la url completa
			try {
				const urlObj = new URL(link.href)
				urls.push(urlObj.href)
			} catch (err) {
				if (err instanceof Error) {
					await logErrorLocal(`Error parsing url ${err.message}, Stack trace:\n ${err.stack?.split('\n').slice(0, 5)}`)
				} else {
					await logErrorLocal(`Unknown error parsing complete url`)
				}
			}
		}
	}
	return urls
}

export function normalizeURL(url: string): string {
	const urlObj = new URL(url)
	const hostPath = `${urlObj.hostname}${urlObj.pathname}`

	if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
		return hostPath.slice(0, -1)
	}
	return hostPath
}

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
