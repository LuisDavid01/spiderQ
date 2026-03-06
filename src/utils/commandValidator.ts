
const ALLOWED_COMMANDS = ['-n nmap','nmap', 'grep', 'find', 'ffuf']

const REQUIRE_ARGS: Record<string, boolean> = {
	nmap: true,
	find: true,
	grep: true,
}

const DANGEROUS_PATTERNS = /[;&|`$(){}<>\[\]!#*]|\$\{|>>|<<|\|\|/

export function validateCommand(toolName: string, userArgs: string): {
	valid: boolean
	error?: string
} {
	const baseCommand = toolName.replace(/^sudo\s+/, '')

	if (!ALLOWED_COMMANDS.includes(baseCommand)) {
		return { valid: false, error: `Command '${baseCommand}' not allowed` }
	}

	if (REQUIRE_ARGS[baseCommand] && !userArgs.trim()) {
		return { valid: false, error: 'Arguments required' }
	}

	if (DANGEROUS_PATTERNS.test(userArgs)) {
		return { valid: false, error: 'Dangerous pattern detected' }
	}

	return { valid: true }
}
