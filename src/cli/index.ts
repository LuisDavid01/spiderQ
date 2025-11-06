/**
 * Archivo: src/cli/index.ts
 * Qué es: punto de entrada del CLI de SpiderQ.
 * Qué hace: pinta el banner bonito, registra comandos (chat y spider) con Commander,
 *           y arranca el flujo correcto. Se queda encendido hasta que se cierre el chat.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';

import { showWelcome, printTip } from './ui.js';
import { chatLoop } from './loop.js';
import { spiderDemo } from './spiderDemo.js';
import { cleanDbIfNeeded } from './maintenance.js';

// Hooks de diagnóstico: si algo raro pasa, lo verás en consola.
// Útiles en desarrollo; si molestan, simplemente coméntalos.
process.on('beforeExit', (code) => console.log('[diag] beforeExit', code));
process.on('exit',       (code) => console.log('[diag] exit', code));
process.on('uncaughtException', (err) => console.error('[diag] uncaughtException', err));
process.on('unhandledRejection', (reason) => console.error('[diag] unhandledRejection', reason));

const program = new Command();

// Banner inicial
showWelcome();

program
  .name('SpiderQ')
  .description('CLI Pentest Assistant (conversacional + tools)')
  .version('0.1.0')
  .showHelpAfterError(true)   // si se equivoca en un comando, muestra ayuda
  .enablePositionalOptions()  // permite opciones después de argumentos posicionales
  .exitOverride();            // evita que Commander mate el proceso sin pedir permiso

program
  .command('chat')
  .description('Iniciar chat interactivo (tipo ChatGPT/Gemini)')
  .option('-q, --question <text>', 'Lanzar una primera pregunta y seguir en modo interactivo')
  .action((opts) => {
    // Se retorna la promesa para que Commander no cierre el proceso
    return (async () => {
      await cleanDbIfNeeded();      // limpia/compacta db.json antes de arrancar
      return chatLoop(opts.question); // el loop queda funcionando hasta exit / Ctrl+C
    })();
  });

program
  .command('spider')
  .description('Demo rápida de descubrimiento de subdirectorios (mock)')
  .argument('<url>', 'URL objetivo (ej: https://example.com)')
  .action((url: string) => {
    // Retornamos la promesa por coherencia
    return (async () => {
      await cleanDbIfNeeded();
      return spiderDemo(url);
    })();
  });

// Si no pasan subcomando, mostramos un mini “menú” con tips
if (!process.argv.slice(2).length) {
  const title = gradient.atlas(
    figlet.textSync('SpiderQ', { horizontalLayout: 'fitted' })
  );
  console.log(title);
  console.log(
    boxen(
      `${chalk.cyan('SpiderQ • CLI Pentest Assistant')}\n\n` +
        `${chalk.bold('Comandos:')}\n` +
        `  ${chalk.green('chat')}     Inicia el chat interactivo\n` +
        `  ${chalk.green('spider')}   Demo: spider <url>\n\n` +
        `${chalk.dim('Tip: usa  ')}${chalk.yellow('npm run chat')} ${chalk.dim('para entrar directo al chat')}`,
      { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
    )
  );
  printTip('Usa /spider URL para demo de subdirectorios durante el chat');
}

// Se ejecuta parseAsync sin top-level await (evita warning)
void (async () => {
  try {
    await program.parseAsync(process.argv);
  } catch (err: any) {
    console.error(err?.message || err);
    process.exitCode = 1; // deja el código de salida sin tumbar de golpe el proceso
  }
})();
