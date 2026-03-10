
const ALLOWED_COMMANDS = ['-n nmap','nmap', 'grep', 'find', 'ffuf', 'whois', 'ls']

const REQUIRE_ARGS: Record<string, boolean> = {
	nmap: true,
	find: true,
	grep: true,
}

const DANGEROUS_PATTERNS = /[;&|`$(){}<>\[\]!#*]|\$\{|>>|<<|\|\|/

export function validateCommand(toolName: string, userArgs: string): {
	valid: boolean
	command: string
	error?: string
} {
	const baseCommand = toolName.replace(/^sudo\s+/, '')
	const trimmedArgs = userArgs.trim()
	if (!ALLOWED_COMMANDS.includes(baseCommand)) {
		return { valid: false, command: '',error: `Command '${baseCommand}' not allowed` }
	}

	if (REQUIRE_ARGS[baseCommand] && !trimmedArgs) {
		return { valid: false,  command: '',error: 'Arguments required' }
	}

	if (DANGEROUS_PATTERNS.test(userArgs)) {
		return { valid: false,  command: '',error: 'Dangerous pattern detected' }
	}
	const validatedCommand = `${toolName} ${trimmedArgs}`

	return { valid: true,  command: validatedCommand }
}
