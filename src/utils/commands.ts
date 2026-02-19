import { exec } from 'child_process';
import util from 'node:util';
import { validateCommand } from './commandValidator';

const execPromise = util.promisify(exec);

interface ExecuteOptions {
	timeout?: number
}

export async function executeCommand(
	toolName: string,
	userArgs: string,
	options: ExecuteOptions = {}
) {
	const { timeout = 30000 } = options

	const validation = validateCommand(toolName, userArgs)

	if (!validation.valid) {
		return {
			success: false,
			stdout: '',
			stderr: validation.error || 'Invalid command',
			error: 'Validation failed'
		}
	}

	try {
		const cmd = `${toolName} ${userArgs}`
		const { stdout, stderr } = await execPromise(cmd, {
			timeout,
			maxBuffer: 1024 * 1024 * 10

		});

		return {
			success: true,
			stdout: stdout,
			stderr: stderr,
			error: null
		};
	} catch (error: any) {
		return {
			success: false,
			stdout: error.stdout || '',
			stderr: error.stderr || '',
			error: error.message
		};
	}
}
