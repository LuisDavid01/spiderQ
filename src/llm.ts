import type { AIMessage } from '../types'
import { getClient } from './ai'
import { formatToolsForProvider } from './utils/toolSchema'
import { systemPrompt } from './systemPrompt'
import { loadConfig } from './config/globalConfig.js'



// Llama al LLM con el contexto y herramientas usando clientes específicos

export const runLLM = async ({ messages, tools }: { messages: AIMessage[], tools: any[] }) => {
	const CONFIG = loadConfig();
	// Obtener cliente específico del provider
	const client = getClient(CONFIG.provider)
	
	// Formatear tools para el provider específico usando Zod v4 nativo
	const formattedTools = formatToolsForProvider(tools, CONFIG.provider)
	
	// Configuración base de la solicitud
	const baseRequest = {
		model: CONFIG.model,
		messages: [{ role: 'system' as const, content: systemPrompt }, ...messages],
	}

	// Configuración específica por provider
	if (CONFIG.provider === 'openrouter') {
		// OpenRouter con tools habilitados
		const response = await client.chat.completions.create({
			...baseRequest,
			tools: formattedTools as any,
			tool_choice: 'auto' as const,
		} as any)

		return response.choices[0].message
	} else {
		const response = await client.chat.completions.create({
			...baseRequest,
			tools: formattedTools,
			tool_choice: 'auto' as const,
			parallel_tool_calls: false ,
			max_completion_tokens: 2048,
		})	

		return response.choices[0].message
	}
}

