import { z } from 'zod'
import { encode } from '@toon-format/toon'
import { executeCommand } from '@/utils/commands'
import type { ToolFn } from 'types'

export const fileSearchToolDefinition = {
	name: 'fileSearch',
	parameters: z
		.object({
			path: z.string().describe('directory path to search'),
			pattern: z.string().describe('search pattern (filename or text)'),
			searchType: z.enum(['filename', 'content']).default('filename'),
		})
		.describe('Search for files by name or content'),
}

type Args = z.infer<typeof fileSearchToolDefinition.parameters>

export const fileSearchFn: ToolFn<Args, string> = async ({ toolArgs }) => {
	const { path, pattern, searchType } = toolArgs

	const toolName = searchType === 'filename' ? 'find' : 'grep'
	const args =
		searchType === 'filename'
			? `${path} -name "${pattern}"`
			: `-r "${pattern}" ${path}`

	const result = await executeCommand(toolName, args, { timeout: 120000 })

	if (!result.success) {
		return encode(result.stderr || 'No results found')
	}
	return encode(result.stdout || 'No results found')
}
