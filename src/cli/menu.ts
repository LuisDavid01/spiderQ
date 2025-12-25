import readline from 'node:readline';
import chalk from 'chalk';
import boxen from 'boxen';
import gradient from 'gradient-string';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q: string): Promise<string> =>
  new Promise((res) => rl.question(q, res));

export async function selectAI() {
  console.clear();

  console.log(
    boxen(
      gradient.mind('🕷 SpiderQ · AI Selector'),
      { padding: 1, borderStyle: 'round' }
    )
  );

  console.log(chalk.cyan('\nSelecciona proveedor:\n'));
  console.log('  1) openai');
  console.log('  2) openrouter');

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
          'gpt-4.1',
          'gpt-4o-mini',
          'o4-mini',
        ]
      : [
          'anthropic/claude-3.5-sonnet',
          'google/gemini-2.0-flash',
          'meta-llama/llama-3.1-70b-instruct',
        ];

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

