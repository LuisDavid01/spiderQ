import type { AIMessage } from '../types'
import { openai } from './ai'
import { zodFunction } from 'openai/helpers/zod'
import { defaultSystemPrompt } from './systemPrompt'


// Llama al LLM con el contexto y herramientas

export const runLLM = async ({ 
	messages, 
	tools = [], 
	systemPrompt }:
	{
		messages: AIMessage[],
		tools?: any[],
		systemPrompt?: string
	}) => {
	// las tools deben seguir un formato especifico
	const formattedTools = tools.map(zodFunction)
	const response = await openai.chat.completions.create({
		model: 'gpt-5-nano',
		messages: [
			{ role: 'system', content: systemPrompt || defaultSystemPrompt }
			, ...messages
		],
		...(formattedTools.length > 0 && {
			tools: formattedTools,
			tool_choice: 'auto',
			parallel_tool_calls: false,
		}),
	})

	return response.choices[0].message
}

export const summarizeMessages = async (messages: AIMessage[]) => {
	const response = await runLLM({
		systemPrompt:
			'Summarize the key points of the conversation in a concise way that would be helpful as context for future interactions. Make it like a play by play of the conversation.',
		messages,
	})

	return response.content || ''
}
