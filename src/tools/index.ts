import { crawlerToolDefinition } from "./crawler";
import { createWordListToolDefinition } from "./createWordlist";
import { ffufToolDefinition } from "./ffuzfTool";
import { nmapToolDefinition } from "./nmap";
import { whoisToolDefinition } from "./whoisTool";

// cada tool debe estar en un archivo separado y se definen aqui los 
// tools que usara el agente
export const tools = [
	crawlerToolDefinition,
	nmapToolDefinition,
	createWordListToolDefinition,
	ffufToolDefinition,
	whoisToolDefinition,
]
