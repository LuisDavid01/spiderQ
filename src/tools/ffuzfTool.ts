import { z } from 'zod'
import { encode } from '@toon-format/toon'
import { logErrorLocal } from '@/utils/logs'
import { executeCommand } from '@/utils/commands'
import {platform, homedir} from 'os';
import type { ToolFn } from 'types'

export const fuffToolDefinition = {
	name: 'nmapTool',
	parameters: z
		.object({
			fuffOptions: z
				.string()
				.describe(
					'flags for fuff, do not include "-u" or "-w" option are already included'
				),
			targetURL: z
				.string()
				.describe(
					'URL of the target'
				),

			

		})
		.describe('this tool is used to get information about a website'),
}

type Args = z.infer<typeof fuffToolDefinition.parameters>

export const fuffFinder: ToolFn<Args, string> = async ({
	toolArgs,
	userMessage,
}) => {

	const { fuffOptions, targetURL } = toolArgs
	const homeDirectory = homedir()
	
	const baseCommand = `fuff -u ${targetURL} -w ${homeDirectory}/wordlists/common.txt ${fuffOptions} -s`
	const result = await executeCommand(baseCommand, fuffOptions, { timeout: 200000 })

	if (!result.success) {
		logErrorLocal(`[fuff] error: ${result.stderr}`)
		const response = JSON.stringify(result.stderr)

		return encode(response)
	}
	const response = JSON.stringify(result.stdout)
	return encode(response)
}
