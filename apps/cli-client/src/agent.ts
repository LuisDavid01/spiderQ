/**
 * Archivo: src/agent.ts
 * Qué es: el “cerebro” que conversa con el LLM y ejecuta tools cuando el modelo las pide.
 * Qué hace: agrega tu mensaje al historial, consulta al LLM, ejecuta la tool si corresponde
 *           y devuelve SOLO el texto final para imprimirlo en el CLI (sin dumps del historial).
 */

import { runLLM } from "./llm";
import { addMessage, getMessages, saveToolResponse } from "./memory";
import { runTool } from "./toolRunner";
import { showLoader } from "./ui";


type RunAgentInput = {
  userMessage: string;
  tools: any[];
};

export const runAgent = async ({ userMessage, tools }: RunAgentInput): Promise<string> => {
  await addMessage([{ role: 'user', content: userMessage }]);

  const loader = showLoader('Im thinking really hard rn.......😒😒😒\n');

  while (true) {
    const context = await getMessages();

    const response = await runLLM({ messages: context, tools });

    await addMessage([response]);

    if (response.content) {
      loader.stop();

      const text = response.content 
      return text.trim();
    }

    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolCall = response.tool_calls[0];

	  if (toolCall.type != 'function') {
		  loader.stop();
		  return 'No pude generar una respuesta en este turno. Intenta reformular o vuelve a preguntar.';
	  }

      loader.update(`calling tool 📲📶 ${toolCall.function.name}\n`);

      const toolResponse = await runTool(toolCall, userMessage);

      await saveToolResponse(toolCall.id, toolResponse);

      loader.update(`Tool already answer 😍 ${toolCall.function.name}\n`);

      continue;
    
	}

    loader.stop();
    return 'No pude generar una respuesta en este turno. Intenta reformular o vuelve a preguntar.';
  }
};
