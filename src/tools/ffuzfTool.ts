import { z } from 'zod'
import { encode } from '@toon-format/toon'
import { logErrorLocal } from '../utils/logs'
import { executeCommand } from '../utils/commands'
import { platform, homedir } from 'os';
import type { ToolFn } from 'types'
import { getSessionId } from '../memory';
import path from 'path';
import fs from 'fs/promises';

export const fuffToolDefinition = {
	name: 'nmapTool',
	parameters: z
		.object({
			fuffOptions: z
				.string()
				.describe(
					'flags for fuff, do not include "-u" or "-w" option are already included'
				),
			targetURL: z
				.string()
				.describe(
					'URL of the target'
				),



		})
		.describe('this tool is used to get information about a website'),
}

type Args = z.infer<typeof fuffToolDefinition.parameters>

export const fuffFinder: ToolFn<Args, string> = async ({
	toolArgs,
	userMessage,
}) => {


	const { fuffOptions, targetURL } = toolArgs
	const homeDirectory = homedir()
	const sessionId = await getSessionId()
	console.log(sessionId)

	const pathDir = path.join(homeDirectory, 'spiderQ', 'wordlists')
	const outputDir = path.join(pathDir, `json_results`)

	const baseCommand = `ffuf`
	const commandParameters = `-u ${targetURL} -w ${pathDir}/${sessionId}.txt ${fuffOptions} -o ${outputDir}/${sessionId}.json `


	const result = await executeCommand(baseCommand, commandParameters, { timeout: 200000 })

	if (!result.success) {
		logErrorLocal(`[fuff] error: ${result.stderr}`)
		const response = JSON.stringify(result.stderr)

		return encode(response)
	}

	const data = await createFuffOutputFromId(sessionId, outputDir)

	const usefulData = JSON.stringify(data)
	return encode(usefulData)

}

export async function createFuffOutputFromId(sessionId: string, outputDir: string) {
	try {
		const file = await fs.readFile(`${outputDir}/${sessionId}.json`, "utf8")
		const data = JSON.parse(file)
		return data.results
	} catch (error) {
		logErrorLocal(`[fuff] error: ${error}`)
		const response = "No se pudo encontrar el archivo, por favor revisar los logs locales del usuario"
		return response
	}
}




