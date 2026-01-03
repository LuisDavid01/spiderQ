import readline from 'node:readline';
import chalk from 'chalk';
import boxen from 'boxen';
import gradient from 'gradient-string';
import figlet from 'figlet';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const ask = (q: string): Promise<string> =>
	new Promise((res) => rl.question(q, res));

export async function selectAI() {
	console.clear();

	const title = gradient.vice(
		figlet.textSync('SPIDERQ', { horizontalLayout: 'fitted' })
	);
	console.log(title);

	// Subtítulo 
	const subtitle = `${chalk.cyan('SpiderQ')} ${chalk.white('•')} ${chalk.white('CLI Pentest Assistant')}`;
	console.log(subtitle, '\n');
	console.log('provide a valid api key you can get yours in https://spiderq.tech/dashboard.\n')
	console.log('')

	let apikey = process.env.API_KEY
	if (!apikey) {
		const userapikey = await ask('Api key: ');
		if (userapikey.length <= 1) {
			console.error(chalk.red.underline('\napi key cannot be empty\n'));
			process.exit(1);
		}

		// validarla en el backend
		apikey = userapikey
		console.log(chalk.greenBright('api key validada\n'));
	}


	console.log(chalk.cyan('\nSelecciona proveedor:\n'));
	console.log('  1) openai');
	console.log('  2) openrouter');
	console.log(chalk.bgBlack.red.underline('openrouter no tiene acceso a tools por el momento'))
	const providerChoice = await ask('\n> ');

	let provider: 'openai' | 'openrouter';

	if (providerChoice === '1') provider = 'openai';
	else if (providerChoice === '2') provider = 'openrouter';
	else {
		console.log(chalk.red('❌ Opción inválida'));
		process.exit(1);
	}

	const models =
		provider === 'openai'
			? [
				'gpt-5-nano',
				'gpt-5-mini',
			]
			: [
				'openai/gpt-oss-120b:free',
				'openai/gpt-oss-20b:free',
				'qwen/qwen3-coder:free',
				'moonshotai/kimi-k2:free',
				'deepseek/deepseek-r1-0528:free',
			];

	/*
	 // only chatgpt
		const models = [
			'gpt-5-nano',
			'gpt-5-mini',
			'gpt-5',
		]
	*/
	console.log(chalk.cyan('\nSelecciona modelo:\n'));

	models.forEach((m, i) => {
		console.log(`  ${i + 1}) ${m}`);
	});

	const modelChoice = await ask('\n> ');
	const index = Number(modelChoice) - 1;

	if (!models[index]) {
		console.log(chalk.red('❌ Modelo inválido'));
		process.exit(1);
	}

	rl.close();

	return {
		provider,
		model: models[index],
	};
}

