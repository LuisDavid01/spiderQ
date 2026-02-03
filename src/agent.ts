import { runLLM } from "./llm";
import { addMessage, getMessages, saveToolResponse } from "./memory";
import { runTool } from "./toolRunner";
import { showLoader } from "./ui";
import { loadConfig } from "./config/globalConfig.js";
import { logErrorLocal } from "./utils/logs.js";


type RunAgentInput = {
  userMessage: string;
  tools: any[];
};

export const runAgent = async ({ userMessage, tools }: RunAgentInput): Promise<string> => {
  await addMessage([{ role: 'user', content: userMessage }]);

  const CONFIG = loadConfig();
  const loader = showLoader(`${CONFIG.model} is thinking really hard rn.......😒😒😒\n`);

  while (true) {
    const context = await getMessages();

    const response = await runLLM({ messages: context, tools });
	await logErrorLocal(`[DEBUG] response: ${JSON.stringify(response.content)}`)
    
    if (response.content) {
      
	  await addMessage([response]);
      const text = response.content 
	  loader.stop();
      return text.trim();
    }

    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolCall = response.tool_calls[0];

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
