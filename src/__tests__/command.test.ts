import { executeCommand } from '../utils/commands'
import { test, expect, describe } from 'vitest'

test('Execute command', async () => {
	const result = await executeCommand('sudo -n nmap', '-sV -p 80 127.0.0.1', { timeout: 100000 })
	console.log(result)
	expect(result.success).toBe(true)

}, 100000)
