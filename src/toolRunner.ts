import type OpenAI from "openai"
import { generateImage, generateImageToolDefinition } from "./tools/genImage"
import { reddit, redditToolDefinition } from "./tools/reddit"
import { crawler, crawlerToolDefinition } from "./tools/crawler"


export const runTool = async (toolCall:
	OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
	userMessage: string
) => {
	const input = {
		userMessage,
		toolArgs: JSON.parse(toolCall.function.arguments)
	}

	// Dependiendo de la herramienta se debe ejecutar una u otra
	// y devolver su resultado al LLM
	switch (toolCall.function.name) {
		case generateImageToolDefinition.name:
			return await generateImage(input)
		case redditToolDefinition.name:
			return await reddit(input)
		case crawlerToolDefinition.name:
			return await crawler(input)
		default:
			return `Stop dont call this tool again ${toolCall.function.name}`
	}
}
