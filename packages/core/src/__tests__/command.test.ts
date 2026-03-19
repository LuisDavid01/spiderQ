import { logErrorLocal } from '@/utils/logs'
import { executeCommand } from '../utils/commands'
import { test, expect, describe } from 'vitest'

test('Execute invalid command', async () => {
	const result = await executeCommand('ping','127.0.0.1', { timeout: 100000 })
	expect(result.success).toBe(false)
	await logErrorLocal(result.error)
	expect(result.error).toBe('Validation failed')

}, 100000)

test('Execute valid command', async () => {
	const result = await executeCommand('ls','-la', { timeout: 100000 })
	expect(result.success).toBe(true)

}, 100000)
