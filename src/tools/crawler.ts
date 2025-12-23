import { z } from 'zod'
import type { Pages, ToolFn } from '../../types'
import { encode } from '@toon-format/toon'
import {parseHTML} from 'linkedom'

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
	if (pages[normalizedCurrentUrl] > 0) {
		pages[normalizedCurrentUrl]++
		return pages
	}

	pages[normalizedCurrentUrl] = 1


	try {
		const resp = await fetch(currentURL)
		// si la pagina no es accesible o da error la saltamos
		if (resp.status > 399) {
			
			return pages
		}
		// si la pagina no es un html la saltamos
		const contentType = resp.headers.get('content-type')
		if (!contentType || !contentType.includes("text/html")) {
			//log error
			return pages

		}

		const htmlBody = await resp.text()
		// obtenemos las url de la pagina actual
		const nextUrls = urlFromHTML(htmlBody, baseURL)

		for (const nextUrl of nextUrls) {
			// por cada pagina buscamos las url recursivamente
			pages = await crawlPage(baseURL, nextUrl, pages)
			delay(Math.random() * (3243 - 569) + 569)
		}
	} catch (err) {
		if (err instanceof Error) {
			//console.log(`Error fetching the URL: ${err.message}, on page ${currentURL}`);
		} else {
			//console.log(`Unknown error occurred on page ${currentURL}`);
		}
	}
	// retornamos el objeto con todas las url encontradas
	return pages
}

// Extrae los hipervinculos de un cuerpo HTML
export function urlFromHTML(htmlBody: string, baseURL: string) {
	const urls = []
	const {document} = parseHTML(htmlBody)
	const links = document.querySelectorAll('a')
	for (const link of links) {
		// validamos si es  una url relativa

		if (link.href.slice(0, 1) === '/') {
			try {
				const urlObj = new URL(`${baseURL}${link.href}`)
				urls.push(urlObj.href)
			} catch (error) {
				//console.log(error)
			}
		} else {
			// agregamos la url completa
			try {
				const urlObj = new URL(link.href)
				urls.push(urlObj.href)
			} catch (error) {
				//console.log(error)
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
