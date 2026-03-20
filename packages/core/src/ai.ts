import 'dotenv/config';
import OpenAI from 'openai';
import { GlobalConfig } from './utils/config';



const OpenAIclient = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
});

const OperRouterClient = new OpenAI({
	apiKey: process.env.OPENROUTER_API_KEY,
	baseURL: 'https://openrouter.ai/api/v1',
});

const LocalAIClient = new OpenAI({
	baseURL: GlobalConfig.localUrl,
	apiKey: 'any',
});

export function getClient() {
	const provider = GlobalConfig.provider
	switch (provider) {
		case 'openai':
			return OpenAIclient;
		case 'operrouter':
			return OperRouterClient;
		case 'local':
			return LocalAIClient;
		default:
			return OpenAIclient;
	}
};

