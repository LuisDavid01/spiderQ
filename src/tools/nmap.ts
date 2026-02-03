import { z } from 'zod'
import type { ToolFn } from '../../types'
import { encode } from '@toon-format/toon'
import { logErrorLocal } from '../utils/logs'
import { executeCommand } from '../utils/commands'

export const nmapToolDefinition = {
	name: 'nmapTool',
	parameters: z
		.object({
			commandParameters: z
				.string()
				.describe(
					'commando parameters to run nmap'
				),
		})
		.describe('this tool is used to get information about a website'),
}

type Args = z.infer<typeof nmapToolDefinition.parameters>

export const nmapFinder: ToolFn<Args, string> = async ({
	toolArgs,
	userMessage,
}) => {

	const { commandParameters } = toolArgs

	const result = await executeCommand(`nmap ${commandParameters}`)

	if (!result.success) {
		logErrorLocal(`[nmap] error: ${result.stderr}`)
		const response = JSON.stringify(result.stderr)

		return encode(response)
	}
	const response = JSON.stringify(result.stdout)
	return encode(response)
}
