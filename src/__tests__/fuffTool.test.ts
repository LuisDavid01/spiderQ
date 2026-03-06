import { createFuffOutputFromId } from '../tools/ffuzfTool'
import { executeCommand } from '../utils/commands'
import { homedir } from 'os';
import path from 'path';
import { test, expect, describe } from 'vitest'

describe('Fuff locate wordlist file', () => {
	test('Fuff uses the correct wordlist by sessionId', async () => {
		const target = 'https://luisdavid01.me/FUZZ'
		const fuffOptions = ''

		const sessionId = 'mock-session'
		const homeDirectory = homedir()
		const pathDir = path.join(homeDirectory, 'spiderQ', 'wordlists')
		const outputDir = path.join(pathDir, `json_results`)

		const baseCommand = `ffuf`
		const commandParameters = `-u ${target} -w ${pathDir}/${sessionId}.txt ${fuffOptions} -o ${outputDir}/${sessionId}.json `


		const commandResult = await executeCommand(baseCommand, commandParameters, { timeout: 200000 })
		expect(commandResult.success).toBe(true)

		const result = await createFuffOutputFromId(sessionId, outputDir)

		expect(result.length).toBeGreaterThan(1)
	})
})


describe('Fuff show error', () => {
	test('Fuff tries to read a file that does not exist', async () => {

		const sessionId = 'mock-session-non-existent'
		const homeDirectory = homedir()
		const pathDir = path.join(homeDirectory, 'spiderQ', 'wordlists')
		const outputDir = path.join(pathDir, `json_results`)


		const result = await createFuffOutputFromId(sessionId, outputDir)

		expect(result).toBe("No se pudo encontrar el archivo, por favor revisar los logs locales del usuario")
	})
})
