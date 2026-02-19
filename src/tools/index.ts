import { crawlerToolDefinition } from "./crawler";
import { generateImageToolDefinition } from "./genImage";
import { nmapToolDefinition } from "./nmap";
import { redditToolDefinition } from "./reddit";
import { fileSearchToolDefinition } from "./fileSearch";

// cada tool debe estar en un archivo separado y se definen aqui los 
// tools que usara el agente
export const tools = [
	generateImageToolDefinition,
	redditToolDefinition,
	crawlerToolDefinition,
	nmapToolDefinition,
	fileSearchToolDefinition,
]
