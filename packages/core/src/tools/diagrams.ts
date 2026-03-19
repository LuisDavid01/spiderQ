import { z } from 'zod'
import { logErrorLocal } from '../utils/logs'
import fs from 'fs/promises';
import { platform, homedir } from 'os';
import path from 'path';
import { getSessionId } from '../memory';
import type { ToolFn } from '../../types';
import { executeCommand } from '@/utils/commands';

export const diagramToolDefinition = {
	name: 'diagramTool',
	parameters: z
		.object({
			diagramCode: z
				.string()
				.describe(
					'You will use mermaid diagram syntax to create a diagram related to the target when using special characters wrap the code with quoutes like this <anyIdentifier>["inyection point(xss)"]'
				),
		})
		.describe('use this tools when you have relevant target information to create a visual diagram using mermaid'),
}

type Args = z.infer<typeof diagramToolDefinition.parameters>

export const createDiagram: ToolFn<Args, string> = async ({
	toolArgs,
	userMessage,
}) => {

	const { diagramCode } = toolArgs

	const sessionId = await getSessionId()
	console.log(sessionId)
	const result = await createDiagramLocal(diagramCode, sessionId)
	return result


}


export async function createDiagramLocal(diagramCode: string, sessionId: string | number) {

	try {

		const homeDirectory = homedir()
		const pathDir = path.join(homeDirectory, '.spiderq', 'diagrams')
		await fs.mkdir(pathDir, { recursive: true })
		await fs.writeFile(`${pathDir}/${sessionId}.mmd`, diagramCode)

		const result = await executeCommand(`mmdc`, `-i ${pathDir}/${sessionId}.mmd -o ${pathDir}/${sessionId}.png`)

		if (!result.success) {
			await logErrorLocal(`[diagram] error: ${result.stderr}`)
			const response = "No se pudo crear el archivo, por favor revisar los logs locales del usuario"
			return response
		}

		return `diagram created correctly in user path .spiderq/diagrams/${sessionId}.png`

	} catch (error) {
		await logErrorLocal(`[wordlist] error: ${error}`)
		const response = "No se pudo crear el archivo, por favor revisar los logs locales del usuario"
		return response
	}

}
