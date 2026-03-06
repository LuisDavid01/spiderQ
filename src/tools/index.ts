import { crawlerToolDefinition } from "./crawler";
import { nmapToolDefinition } from "./nmap";

// cada tool debe estar en un archivo separado y se definen aqui los 
// tools que usara el agente
export const tools = [
	crawlerToolDefinition,
	nmapToolDefinition,
]
