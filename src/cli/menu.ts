import chalk from 'chalk';
import boxen from 'boxen';
import gradient from 'gradient-string';
import figlet from 'figlet';
import fs from 'fs';
import path from 'path';
import { ReadlineManager } from './readline-manager.js';
import type { SpiderQConfig } from '../config/globalConfig.js';

const readlineManager = ReadlineManager.getInstance();

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
		const userapikey = await readlineManager.askOnce('Api key: ');
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
	const providerChoice = await readlineManager.askOnce('\n> ');

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

	const modelChoice = await readlineManager.askOnce('\n> ');
	const index = Number(modelChoice) - 1;

	if (!models[index]) {
		console.log(chalk.red('❌ Modelo inválido'));
		process.exit(1);
	}

	return {
		provider,
		model: models[index],
		apiKey: apikey!,
		summaryModel: models[index]
	} as SpiderQConfig;
}

export function saveConfig(config: SpiderQConfig): void {
	const configPath = path.join(process.cwd(), 'config.json');
	fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
	console.log(chalk.green('✅ config.json created successfully'));
}