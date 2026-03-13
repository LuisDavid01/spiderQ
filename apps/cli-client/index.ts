import 'dotenv/config'
import { runAgent } from './src/agent'
import { tools } from './src/tools'
const userMessage = process.argv[2]

if (!userMessage) {
	console.error('Please provide a message')
	process.exit(1)
}

// corre el agente con el mensaje del usuario
await runAgent({
	userMessage,
	tools: tools
})

