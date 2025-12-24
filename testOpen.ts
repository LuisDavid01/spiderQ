import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});
const model = process.argv[2] || 'openai/gpt-oss-120b:free';

async function main() {
  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  });

  console.log(completion.choices[0].message);
}

main();
