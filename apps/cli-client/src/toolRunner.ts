import type OpenAI from "openai"
import { crawler, crawlerToolDefinition } from "./tools/crawler"
import { nmapFinder, nmapToolDefinition } from "./tools/nmap"
import { ffufFinder, ffufToolDefinition } from "./tools/ffuzfTool"
import { lookupWhois, whoisToolDefinition } from "./tools/whoisTool"
import { createWordList, createWordListToolDefinition } from "./tools/createWordlist"


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
		case crawlerToolDefinition.name:
			return await crawler(input)
		case nmapToolDefinition.name:
			return await nmapFinder(input)
		case ffufToolDefinition.name:
			return await ffufFinder(input)
		case whoisToolDefinition.name:
			return await lookupWhois(input)
		case createWordListToolDefinition.name:
			return await createWordList(input)
		default:
			return `Stop dont call this tool again ${toolCall.function.name}`
	}
}
