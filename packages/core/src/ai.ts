import 'dotenv/config';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Falta OPENAI_API_KEY en .env o en variables de entorno.');
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, 
});


export default client;
export { client };
export const openai = client;
