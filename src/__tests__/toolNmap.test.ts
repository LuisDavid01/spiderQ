import { describe, test, expect } from 'vitest'
import { executeCommand } from '../utils/commands'

test('command call', async () => {
	const result = await executeCommand('nmap -sn scanme.nmap.org')
	console.log(result)
	expect(result.success).toBe(true)
}, 10000)
