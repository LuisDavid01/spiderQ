/**
 * Archivo: src/ai.ts
 * Qué es: el bootstrap del cliente de OpenAI para todo el proyecto.
 * Qué hace: carga variables de .env y crea UNA instancia del SDK para reusarla
 *           (evitamos recrearla en cada import).
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
// Validación rápida: sin API key no se ejecuta nada
if (!process.env.OPENAI_API_KEY) {
	throw new Error('Falta OPENAI_API_KEY en .env o en variables de entorno.');
}

// Creamos una sola instancia y la compartimos
const client = new OpenAI({
	baseURL: 'https://openrouter.ai/api/v1',
	apiKey: process.env.OPENROUTER_API_KEY,
});

// Exportes prácticos:
// - default/client: para imports normales
export default client;
export { client };
export const openai = client;
