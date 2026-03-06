import { test, expect, describe } from 'vitest'
import { createWordList } from '../tools/createWordlist'

describe('Create wordlist', () => {
	test('Create wordlist', async () => {
		const sampleWordlist = 'home\nprojects\nspiderQ\n'
		const mockInput = {
			userMessage: 'Create a wordlist',
			toolArgs: {
				wordlistString: sampleWordlist,
			},
		}
		const result = await createWordList(mockInput)
		expect(result).toBe('archivo creado correctamente')
	})
})
