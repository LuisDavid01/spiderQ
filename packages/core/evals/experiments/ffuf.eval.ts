import { ffufToolDefinition } from "@/tools/ffuzfTool";
import { runLLM } from "../../src/llm";
import { runEval } from "../evalTools";
import { ToolCallMatch } from "../scorers";

const createToolCallMessage = (toolName: string) => ({
	role: 'assistant',
	tool_calls: [{
		type: 'function',
		function: {
			name: toolName
		}
	}]
})
runEval('ffuf', {
	task: (input) => runLLM({
		messages: [{role: 'user', content: input}],
			tools:[ffufToolDefinition]
	}),
	data: [
		{
			input: 'Utiliza ffuf para encontrar subdominios en este sitio web de prueba: example.com',
			expected: createToolCallMessage(ffufToolDefinition.name)
		}
	],
	scorers: [ToolCallMatch]

})
