/**
 * Archivo: src/ai.ts
 * Qué es: Factory de clientes para OpenAI y OpenRouter
 * Qué hace: crea instancias específicas por provider con configuraciones adecuadas
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Función para obtener API key con fallback
function getApiKey(): string {
	try {
		// Intentar cargar desde CONFIG primero
		const { CONFIG } = require('./config/globalConfig.js');
		return CONFIG.apiKey;
	} catch {
		// Fallback a variables de entorno
		const envKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
		if (!envKey) {
			throw new Error('No API key found in config.json or environment variables.');
		}
		return envKey;
	}
}

// Cliente OpenAI existente
const openaiClient = new OpenAI({
	apiKey: getApiKey(),
});

// Cliente OpenRouter con configuración específica
const openrouterClient = new OpenAI({
	apiKey: getApiKey(),
	baseURL: 'https://openrouter.ai/api/v1',
	defaultHeaders: {
		'HTTP-Referer': 'https://spiderq.tech',
		'X-Title': 'SpiderQ AI Agent',
	}
});

/**
 * Factory function para obtener el cliente específico del provider
 */
export const getClient = (provider: 'openai' | 'openrouter') => {
	switch (provider) {
		case 'openai':
			return openaiClient;
		case 'openrouter':
			return openrouterClient;
		default:
			throw new Error(`Provider no soportado: ${provider}`);
	}
};

// Exportes prácticos para compatibilidad
export const openai = openaiClient;
export { openrouterClient };
export default openaiClient;
