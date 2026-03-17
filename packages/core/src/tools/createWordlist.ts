import { z } from 'zod'
import { logErrorLocal } from '../utils/logs'
import fs from 'fs/promises';
import { platform, homedir } from 'os';
import path from 'path';
import { getSessionId } from '../memory';
import type { ToolFn } from '../../types';

export const createWordListToolDefinition = {
	name: 'createWordListTool',
	parameters: z
		.object({
			wordlistString: z
				.string()
				.describe(
					'list of words to be used as wordlist separete the word with a new line "\n"'
				),
		})
		.describe('reason about the target then use this tool to create a wordlist to be used by fuff'),
}

type Args = z.infer<typeof createWordListToolDefinition.parameters>

export const createWordList: ToolFn<Args, string> = async ({
	toolArgs,
	userMessage,
}) => {

	const { wordlistString } = toolArgs

	const sessionId = await getSessionId()
	console.log(sessionId)
	const result = await createWordListFromSessionId(wordlistString, sessionId)
	return result


}


export async function createWordListFromSessionId(wordlist: string, sessionId: string | number) {

	try {

		const homeDirectory = homedir()
		const pathDir = path.join(homeDirectory, '.spiderq', 'wordlists')
		await fs.mkdir(pathDir, { recursive: true })
		await fs.writeFile(`${pathDir}/${sessionId}.txt`, wordlist)
		return "archivo creado correctamente"

	} catch (error) {
		await logErrorLocal(`[wordlist] error: ${error}`)
		const response = "No se pudo crear el archivo, por favor revisar los logs locales del usuario"
		return response
	}

}
