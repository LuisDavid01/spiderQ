import { z } from 'zod'
import { encode } from '@toon-format/toon'
import { logErrorLocal } from '../utils/logs'
import { executeCommand } from '../utils/commands'
import { platform, homedir } from 'os';
import { getSessionId } from '../memory';
import path from 'path';
import fs from 'fs/promises';
import type { ToolFn } from '../../types';

export const ffufToolDefinition = {
	name: 'ffufTool',
	parameters: z
		.object({
			ffufOptions: z
				.string()
				.describe(
					'valid flags for ffuf your base command is ffuf -u <targetUrl> -w (defined already) <ffufOptions> -o (defined already), do not duplicate flags '
				),
			targetURL: z
				.string()
				.describe(
					'URL of the target with FUZZ keyword, for example: https://example.com/FUZZ'
				),



		})
		.describe(`use this tool to run ffuf


STRICT RULES:
- Only output VALID ffuf flags.
- Do NOT invent flags.
- Do NOT include the base command "ffuf".
- Do NOT include -u, -w, or -o (they are already handled).
- Include the word FUZZ in the target URL if it dosent have it already.
- Use only official ffuf flags.


VALID FLAGS EXAMPLES:
-c
-r
-t 50
-H "Header: value"
-X POST
-d "body=data"
-of json

INVALID EXAMPLES:
--output-json
	-m "Content-Type: text/html"
	-r 3

	GOAL:
	Generate safe and correct ffuf parameters based on the user request.

				  `),
}

type Args = z.infer<typeof ffufToolDefinition.parameters>

export const ffufFinder: ToolFn<Args, string> = async ({
	toolArgs,
	userMessage,
}) => {


	const { ffufOptions, targetURL } = toolArgs
	const homeDirectory = homedir()
	const sessionId = await getSessionId()

	const pathDir = path.join(homeDirectory, '.spiderq', 'wordlists')
	const outputDir = path.join(pathDir, `json_results`)

	const baseCommand = `ffuf`
	const commandParameters = `-u ${targetURL} -w ${pathDir}/${sessionId}.txt ${ffufOptions} -o ${outputDir}/${sessionId}.json`
	console.log(commandParameters)

	const result = await executeCommand(baseCommand, commandParameters, { timeout: 200000 })

	if (!result.success) {
		await logErrorLocal(`[ffuf] error: ${result.stderr}`)
		const response = JSON.stringify(result.stderr)

		return encode(response)
	}

	try {
		const data = await createFfufOutputFromId(sessionId, outputDir)
		const usefulData = JSON.stringify(data)
		return encode(usefulData)

	} catch (error) {
		await logErrorLocal(`[ffuf] error: ${error}`)
		const response = `tool error: ${error}, command executed: ${baseCommand} ${commandParameters}`
		return response
	}

}

export async function createFfufOutputFromId(sessionId: number, outputDir: string) {
		await fs.mkdir(outputDir, { recursive: true })
		const file = await fs.readFile(`${outputDir}/${sessionId}.json`, "utf8")
		const data = JSON.parse(file)
		return data.results

}




