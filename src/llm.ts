import type { AIMessage } from '../types'
import { openai } from './ai'
import { zodFunction } from 'openai/helpers/zod'
import { systemPrompt } from './systemPrompt'
import { ARGS } from './utils/loadArgs'


// Llama al LLM con el contexto y herramientas

export const runLLM = async ({ messages, tools }: { messages: AIMessage[], tools: any[] }) => {
	// las tools deben seguir un formato especifico
	if (ARGS.provider === 'openrouter') {
		const formatedTools = tools.map(zodFunction)
		const response = await openai.chat.completions.create({
			model: 'qwen/qwen3-coder:free',
			//messages: [{ role: 'system', content: systemPrompt }, ...messages],
			messages: [...messages],
			//tools: formatedTools,
			//tool_choice: 'auto',
			//parallel_tool_calls: false,
		})

		return response.choices[0].message
	} else {
		const formatedTools = tools.map(zodFunction)
		const response = await openai.chat.completions.create({
			model: 'gpt-5-nano',
			messages: [{ role: 'system', content: systemPrompt }, ...messages],
			tools: formatedTools,
			tool_choice: 'auto',
			parallel_tool_calls: false,
		})

		return response.choices[0].message
	}
}

