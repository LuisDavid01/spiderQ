import { crawlerToolDefinition } from "./crawler";
import { generateImageToolDefinition } from "./genImage";
import { redditToolDefinition } from "./reddit";

// cada tool debe estar en un archivo separado y se definen aqui los 
// tools que usara el agente
export const tools = [
	generateImageToolDefinition,
	redditToolDefinition,
	crawlerToolDefinition,
]
