import { z } from 'zod'
import { encode } from '@toon-format/toon'
import { logErrorLocal } from '../utils/logs'
import { executeCommand } from '../utils/commands'
import { platform, homedir } from 'os';
import type { ToolFn } from 'types'
import { getSessionId } from '../memory';
import path from 'path';
import fs from 'fs/promises';

export const ffufToolDefinition = {
	name: 'ffufTool',
	parameters: z
		.object({
			ffufOptions: z
				.string()
				.describe(
					'flags for ffuf, do not include target url, wordlist path or output path here '
				),
			targetURL: z
				.string()
				.describe(
					'URL of the target'
				),



		})
		.describe('use this tool to run ffuf, the base command already specifies the path to the wordlist and the output path, specify the target url but do not include it on the options flags'),
}

type Args = z.infer<typeof ffufToolDefinition.parameters>

export const ffufFinder: ToolFn<Args, string> = async ({
	toolArgs,
	userMessage,
}) => {


	const { ffufOptions, targetURL } = toolArgs
	const homeDirectory = homedir()
	const sessionId = await getSessionId()
	console.log(sessionId)

	const pathDir = path.join(homeDirectory, 'spiderQ', 'wordlists')
	const outputDir = path.join(pathDir, `json_results`)

	const baseCommand = `ffuf`
	const commandParameters = `-u ${targetURL} -w ${pathDir}/${sessionId}.txt ${ffufOptions} -o ${outputDir}/${sessionId}.json`


	const result = await executeCommand(baseCommand, commandParameters, { timeout: 200000 })

	if (!result.success) {
		logErrorLocal(`[ffuf] error: ${result.stderr}`)
		const response = JSON.stringify(result.stderr)

		return encode(response)
	}

	const data = await createFfufOutputFromId(sessionId, outputDir)

	const usefulData = JSON.stringify(data)
	return encode(usefulData)

}

export async function createFfufOutputFromId(sessionId: string, outputDir: string) {
	try {
		const file = await fs.readFile(`${outputDir}/${sessionId}.json`, "utf8")
		const data = JSON.parse(file)
		return data.results
	} catch (error) {
		logErrorLocal(`[ffuf] error: ${error}`)
		const response = "No se pudo encontrar el archivo, por favor revisar los logs locales del usuario"
		return response
	}
}




