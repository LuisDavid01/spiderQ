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

export function getClient() {
	console.log('Provider:', GlobalConfig.provider)
	const provider = GlobalConfig.provider
	if (provider === 'openai') {
		return OpenAIclient
	} else if (provider === 'openrouter') {
		return OperRouterClient
	}

	return OpenAIclient
};

