// testOpen.ts - versión que FUNCIONA con gpt-oss-120b:free y SDK 0.3.10
import { OpenRouter } from '@openrouter/sdk';
import dotenv from 'dotenv';
dotenv.config();

const model = process.argv[2] || 'openai/gpt-oss-120b:free';

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

const tools = [
  {
    type: "function",
    function: {
      name: "get_current_time",
      description: "Devuelve la hora actual",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
];

async function get_current_time() {
  return new Date().toLocaleString('es-AR');
}

let messages: any[] = [
  { role: "system", content: "Eres útil." },
  { role: "user", content: "¿Qué hora es?" },
];

async function main() {
  const first = await openRouter.chat.send({
    model,
    messages,
    tools,
    tool_choice: "auto",
    stream: false,
  });

  let msg = first.choices[0].message;

  // Normalizar toolCalls → tool_calls
  if (msg.toolCalls) {
    msg.tool_calls = msg.toolCalls;
    delete msg.toolCalls;
  }

  messages.push(msg);

  if (msg.tool_calls?.length) {
    for (const tc of msg.tool_calls) {
      if (tc.function.name === "get_current_time") {
        const result = await get_current_time();

        // CLAVE: usar camelCase porque el validador Zod lo busca así
        messages.push({
          role: "tool",
          toolCallId: tc.id,           // ← camelCase
          name: tc.function.name,
          content: JSON.stringify({ hora: result }),
        });
      }
    }

    const final = await openRouter.chat.send({
      model,
      messages,
      stream: false,
    });

    console.log("RESPUESTA FINAL:");
    console.log(final.choices[0].message.content);
  }
}

main().catch(console.error);
