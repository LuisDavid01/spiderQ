import { z } from 'zod'
import type { ToolFn } from '../../types'

export const redditToolDefinition = {
	name: 'reddit',
	parameters: z
		.object({})
		.describe(
			'Use this tool to get useful reddit post about cibersecutiry, it is helpful. It will return a JSON object with the title, link, subreddit, author, and upvotes of each post.'
		),
}

type Args = z.infer<typeof redditToolDefinition.parameters>

export const reddit: ToolFn<Args, string> = async ({
	toolArgs,
	userMessage,
}) => {
	const { data } = await fetch('https://www.reddit.com/r/cybersecurity/.json').then(res => res.json() as any);


	const relevantInfo = data.children.map((child: any) => ({
		title: child.data.title,
		link: child.data.url,
		subreddit: child.data.subreddit_name_prefixed,
		author: child.data.author,
		upvotes: child.data.ups,
	}))

	return JSON.stringify(relevantInfo, null, 2)
}

