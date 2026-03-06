import { z } from 'zod'
import { encode } from '@toon-format/toon'
import { logErrorLocal } from '../utils/logs'
import fs from 'fs';
import { platform, homedir } from 'os';
import type { ToolFn } from 'types'
import path from 'path';
import { getSessionId } from '../memory';

export const CreateWordListToolDefinition = {
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

type Args = z.infer<typeof CreateWordListToolDefinition.parameters>

export const createWordList: ToolFn<Args, string> = async ({
	toolArgs,
	userMessage,
}) => {
	const { wordlistString } = toolArgs
	const homeDirectory = homedir()
	const sessionId = await getSessionId()

	const pathDir = path.join(homeDirectory, 'spiderQ', 'wordlists')
	fs.mkdirSync(pathDir, { recursive: true })
	fs.writeFile(`${pathDir}/${sessionId}.txt`, wordlistString, (err) => {
		if (err) {
			logErrorLocal(`[wordlist] error: ${err}`)
			const response = "No se pudo crear el archivo, por favor revisar los logs locales del usuario"
			return response
		}
	})
	const response = "archivo creado correctamente"
	return response

}
