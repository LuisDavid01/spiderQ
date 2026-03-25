import type { AIMessage } from '../types'
import { zodFunction } from 'openai/helpers/zod'
import { defaultSystemPrompt } from './systemPrompt'
import { getClient } from './ai'
import { GlobalConfig } from './utils/config'
import { getSummary } from './memory'


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
	const model = GlobalConfig.model
	const client = getClient()
	const prevSummary = await getSummary()
	
	const response = await client.chat.completions.create({
		model: model,
		messages: [
			{ role: 'system', content: systemPrompt || defaultSystemPrompt },
			{ role: 'assistant', content: prevSummary },
			 ...messages
		],
		...(formattedTools.length > 0 && {
			tools: formattedTools,
			tool_choice: 'auto',
			parallel_tool_calls: false,
		}),
	})

	return response.choices[0]?.message
}

export const summarizeMessages = async (messages: AIMessage[]) => {
	console.log('summarizeMessages')
	const response = await runLLM({
		systemPrompt:
			'Summarize the key points of the conversation in a concise way that would be helpful as context for future interactions. Make it like a play by play of the conversation.',
		messages: [
			...messages,
		],
	})

	return response?.content || ''
}
