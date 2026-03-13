

import { runLLM } from "./llm";
import { addMessage, getMessages, saveToolResponse } from "./memory";
import { runTool } from "./toolRunner";


type RunAgentInput = {
  userMessage: string;
  tools: any[];
};

export const runAgent = async ({ userMessage, tools }: RunAgentInput): Promise<string> => {
  await addMessage([{ role: 'user', content: userMessage }]);


  while (true) {
    const context = await getMessages();

    const response = await runLLM({ messages: context, tools });

    await addMessage([response]);

    if (response.content) {

      const text = response.content 
      return text.trim();
    }

    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolCall = response.tool_calls[0];

	  if (!toolCall || toolCall?.type != 'function') {
		  return 'No pude generar una respuesta en este turno. Intenta reformular o vuelve a preguntar.';
	  }


      const toolResponse = await runTool(toolCall, userMessage);

      await saveToolResponse(toolCall.id, toolResponse);


      continue;
    
	}

    return 'No pude generar una respuesta en este turno. Intenta reformular o vuelve a preguntar.';
  }
};
