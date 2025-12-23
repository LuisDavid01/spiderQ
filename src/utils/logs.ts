import fs from 'node:fs/promises'
export async function logErrorLocal(message: string) {
	const file = await fs.open(`${process.cwd()}/logs/errors.txt`, 'a')

	try {
		await fs.writeFile(file, `${message}\n`)
	} catch (e) {
	} finally {
		await file.close()
	}
}
