import { exec } from 'child_process';
import util from 'node:util';

const execPromise = util.promisify(exec);
export async function executeCommand(command: string) {
	try {
		const { stdout, stderr } = await execPromise(command, {
			timeout: 30000,
			maxBuffer: 1024 * 1024 * 10 

		});

		return {
			success: true,
			stdout: stdout,
			stderr: stderr,
			error: null
		};
	} catch (error) {
		return {
			success: false,
			stdout: error.stdout || '',
			stderr: error.stderr || '',
			error: error.message
		};
	}
}
