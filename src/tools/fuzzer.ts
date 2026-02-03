import { z } from 'zod'
import type { ToolFn } from '../../types'
import { encode } from '@toon-format/toon'
import { logErrorLocal } from '../utils/logs'

export const fuzzerToolDefinition = {
	name: 'fuzzer',
	parameters: z
		.object({
			baseUrl: z
				.string()
				.describe(
					'base url to look for specific urls'
				),
			wordList: z
			.string()
			.describe(
				'use  this word  list to look inside the base url'
			),
		})
		.describe('this tool is used to find hidden urls inside a website, it takes the base url and a word list as parameters, returns a list of all the links the tool could find.'),
}

type Args = z.infer<typeof fuzzerToolDefinition.parameters>

export const fuzzer: ToolFn<Args, string> = async ({
	toolArgs,
	userMessage,
}) => {

	const { baseUrl, wordList } = toolArgs

	return encode(wordList)
}
