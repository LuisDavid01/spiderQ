import { test, expect, describe } from 'vitest'
import { createWordListFromSessionId } from '../tools/createWordlist'

describe('Create wordlist', () => {
	test('Create wordlist', async () => {
		const sampleWordlist = 'home\nprojects\nspiderQ\nen/\nes/\nblog/\nprimer-post\nes/blog/primer-post\n'
		const sessionId = 'mock-session'
		const result = await createWordListFromSessionId(sampleWordlist, sessionId)
		expect(result).toBe('archivo creado correctamente')
	})
})

