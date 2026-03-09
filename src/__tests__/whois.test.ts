import { test, expect, describe } from 'vitest'
import { lookupWhois } from '../tools/whoisTool'

describe('Lookup whois', () => {
	test('Look for domain name', async () => {
		const mockinput = {
			userMessage: 'Lookup whois for domain name',
			toolArgs: {
				domainName: 'spiderQ.com'
			}
	}
		const result = await lookupWhois(mockinput)
		expect(result.length).toBeGreaterThan(0)
	})
})
