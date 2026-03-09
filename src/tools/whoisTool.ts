import { z } from 'zod'
import { encode } from '@toon-format/toon'
import { logErrorLocal } from '../utils/logs'
import type { ToolFn } from 'types'
import { executeCommand } from '../utils/commands';

export const whoisToolDefinition = {
	name: 'lookupWhois',
	parameters: z
		.object({
			domainName: z
				.string()
				.describe(
					'domain name to lookup'
				),
		})
		.describe('Use this tool to lookup whois information for a domain name or information'),
}

type Args = z.infer<typeof whoisToolDefinition.parameters>

export const lookupWhois: ToolFn<Args, string> = async ({
	toolArgs,
	userMessage,
}) => {

	const { domainName } = toolArgs

	const baseCommand = `whois`
	const result = await executeCommand(baseCommand, domainName, {timeout: 30000})

	if (!result.success) {
		await logErrorLocal('[whois] error: ' + result.stderr)
		return 'No se pudo obtener la información, por favor revisar los logs locales del usuario'
	} 

	const response = encode(result.stdout)
	return JSON.stringify(response)

}



