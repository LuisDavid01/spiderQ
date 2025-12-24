import type { AIMessage } from '../types'
import { openai } from './ai'
import { zodFunction } from 'openai/helpers/zod'
import { systemPrompt } from './systemPrompt'


// Llama al LLM con el contexto y herramientas

export const runLLM = async ({ messages, tools }: { messages: AIMessage[], tools: any[] }) => {
	// las tools deben seguir un formato especifico
	const formatedTools = tools.map(zodFunction)
	const response = await openai.chat.completions.create({
		model: 'openai/gpt-oss-120b:free',
		//messages: [{ role: 'system', content: systemPrompt }, ...messages],
		messages: [...messages],
		//tools: formatedTools,
		//tool_choice: 'auto',
		//parallel_tool_calls: false,
	})

	return response.choices[0].message
}

