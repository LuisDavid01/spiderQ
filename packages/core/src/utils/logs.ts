import fs from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'
export async function logErrorLocal(message: string) {
	const logsPath = `${path.join(homedir(), ".spiderq", "/logs")}`
	await fs.mkdir(`${logsPath}`, { recursive: true })

	const file = await fs.open(`${logsPath}/errors.txt`, 'a')

	try {
		await fs.writeFile(file, `${new Date().toISOString()}: ${message}\n`)
	} catch (e) {
	} finally {
		await file.close()
	}
}
