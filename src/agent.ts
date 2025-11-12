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

const DEBUG = process.env.DEBUG_SPIDERQ === '1';
const dlog = (...args: any[]) => { if (DEBUG) console.log(...args); };

type RunAgentInput = {
  userMessage: string;
  tools: any[];
};

// Flujo principal del agente: devuelve SOLO el texto de la respuesta del assistant
export const runAgent = async ({ userMessage, tools }: RunAgentInput): Promise<string> => {
  // Guardamos el turno del usuario en la “memoria” (para que el LLM tenga contexto)
  await addMessage([{ role: 'user', content: userMessage }]);

  // Un loader simpático mientras el modelo piensa
  const loader = showLoader('Im thinking really hard rn.......😒😒😒\n');

  while (true) {
    // Traemos el historial actual (usuario, assistant, tools, etc.)
    const context = await getMessages();
    dlog('CTX size:', Array.isArray(context) ? context.length : 'n/a');

    // Llamamos al LLM con contexto + catálogo de tools
    const response = await runLLM({ messages: context, tools });

    // Lo que diga el LLM también lo guardamos (para el siguiente turno)
    await addMessage([response]);

    // Caso 1: el LLM ya respondió con texto final → devolvemos ese texto
    if (response.content) {
      loader.stop();

      // Ojo: NO retornamos getMessages(); solo el texto final (evita dumps enormes)
      const text = typeof response.content === 'string'
        ? response.content
        : String(response.content ?? '');
      return text.trim();
    }

    // Caso 2: el LLM pidió una tool → la ejecutamos y seguimos el bucle
    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolCall = response.tool_calls[0];

      // Contamos qué tool estamos corriendo (feedback visual en el loader)
      loader.update(`calling tool 📲📶 ${toolCall.function.name}\n`);

      // Le pasamos a la tool lo que necesite
      const toolResponse = await runTool(toolCall, userMessage);

      // Guardamos la respuesta de la tool como mensaje "tool" para que el LLM la procese
      await saveToolResponse(toolCall.id, toolResponse);

      // Aviso friendly de que la tool ya respondió
      loader.update(`Tool already answer 😍 ${toolCall.function.name}\n`);

      // Volvemos al inicio del while: el siguiente runLLM verá la respuesta de la tool
      continue;
    }

    // Caso 3: ni texto ni tool_calls → devolvemos algo decente y nos vamos
    loader.stop();
    return 'No pude generar una respuesta en este turno. Intenta reformular o vuelve a preguntar.';
  }
};
