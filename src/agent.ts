import { runLLM } from "./llm";
import { addMessage, getMessages, saveToolResponse } from "./memory"
import { runTool } from "./toolRunner";
import { logMessage, showLoader } from "./ui";

// toma el mensaje del usuario y las herramientas disponibles
// corre en un loop hasta que el agente tenga una respuesta "segura"
export const runAgent = async ({
	userMessage,
	tools }: {
		userMessage: string,
		tools: any[]
	}) => {
	await addMessage([{
		role: 'user',
		content: userMessage
	}]);

	const loader = showLoader('Im thinking really hard rn.......😒😒😒\n')
	while (true) {
		const context = await getMessages()

		const response = await runLLM({
			messages: context,
			tools
		})
		await addMessage([response]);

		if (response.content) {
			// respuesta final enviar al usuario
			loader.stop()
			logMessage(response)
			return getMessages()
		}
		if (response.tool_calls) {

			// si llama una herramienta
			// la respuesta se maneja diferente no tiene content y debe 
			// ir despues que la respuesta del usuario siempre
			// y la respuesta debe ir al modelo siempre.

			const toolCalls = response.tool_calls[0]
			loader.update(`calling tool 📲📶 ${toolCalls.function.name}\n`)

			const toolResponse = await runTool(toolCalls, userMessage)
			await saveToolResponse(toolCalls.id, toolResponse)
			loader.update(`Tool already answer 😍 ${toolCalls.function.name}\n`)

		}


	}
}
