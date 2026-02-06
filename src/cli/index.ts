/**
 * Archivo: src/cli/index.ts
 * Qué es: punto de entrada del CLI de SpiderQ.
 * Qué hace: pinta el banner bonito, registra comandos (chat y spider) con Commander,
 *           y arranca el flujo correcto. Se queda encendido hasta que se cierre el chat.
 */

import { Command } from 'commander';
import chalk from 'chalk';

import { ReadlineManager } from './readline-manager';
import { selectAI, saveConfig } from './menu';
import { showWelcome } from './ui';

import { chatLoop } from './loop';
import { loadConfig } from '../config/globalConfig';
import { logErrorLocal } from '../utils/logs';


// Hooks de diagnóstico: si algo raro pasa, lo verás en consola.
// Útiles en desarrollo; si molestan, simplemente coméntalos.
if (process.env.NODE_ENV === 'development') {
	process.on('beforeExit', (code) => console.log('[diag] beforeExit', code));
	process.on('exit', (code) => console.log('[diag] exit', code));
	process.on('uncaughtException', (err) => console.error('[diag] uncaughtException', err));
	process.on('unhandledRejection', (reason) => console.error('[diag] unhandledRejection', reason));
}

// Inicializar el gestor de readline y asegurar cleanup al salir
const readlineManager = ReadlineManager.getInstance();

const program = new Command();

// Banner inicial
//showWelcome();

program
	.name('SpiderQ')
	.description('CLI Pentest Assistant (conversacional + tools)')
	.version('0.1.0')
	.showHelpAfterError(true)   // si se equivoca en un comando, muestra ayuda
	.enablePositionalOptions()  // permite opciones después de argumentos posicionales
	.exitOverride();            // evita que Commander mate el proceso sin pedir permiso


program
	.command('chat')
	.description('Iniciar chat interactivo')
	.action(async () => {
		try {
			// Intentar cargar configuración global
			const CONFIG = loadConfig();

			// Configuración cargada exitosamente
			showWelcome();
			console.log(
				chalk.green(
					`👾 Usando modelo: ${CONFIG.model} del proveedor: ${CONFIG.provider}`
				)
			);

			await chatLoop();
		} catch (error: any) {
			if (error.message === 'NO_CONFIG') {
				// No hay config.json → crearla primero
				console.log(chalk.cyan('🔧 Configuración requerida'));
				const config = await selectAI();
				saveConfig(config);

				// Reintentar carga
				const CONFIG = loadConfig();
				showWelcome();
				console.log(
					chalk.green(
						`👾 Usando modelo: ${CONFIG.model} del proveedor: ${CONFIG.provider}`
					)
				);
				await chatLoop();
			} else {
				// JSON malformado o inválido
				console.error(chalk.red('❌ Error en config.json:'), error.message);
				process.exit(1);
			}
		}
	});


// Se ejecuta parseAsync sin top-level await (evita warning)
void (async () => {
	try {
		await program.parseAsync(process.argv);
	} catch (err: any) {
		console.error(err?.message || err);
		await logErrorLocal(`Error en el CLI: ${err.message}, stack trace:\n ${err.stack?.split('\n').slice(0, 5)}`)
		process.exitCode = 1; // deja el código de salida sin tumbar de golpe el proceso
	}
})();
