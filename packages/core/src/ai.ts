import 'dotenv/config';
import OpenAI from 'openai';
import { GlobalConfig } from './utils/config';



const OpenAIclient = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const OperRouterClient = new OpenAI({
	apiKey: process.env.OPENROUTER_API_KEY,
	baseURL: 'https://openrouter.ai/api/v1',
});

export function getClient() {
	const provider = GlobalConfig.provider
	switch (provider) {
		case 'openai':
			return OpenAIclient;
		case 'operrouter':
			return OperRouterClient;
		case 'local':
			const url = GlobalConfig.localUrl?.trim()

			console.log('Using local AI', url)

			return new OpenAI({
				baseURL: url,
				apiKey: 'sk-local',
			})
		default:
			return OpenAIclient;
	}
};

