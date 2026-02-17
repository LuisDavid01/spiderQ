/**
 * Archivo: src/cli/index.ts
 * Qué es: punto de entrada del CLI de SpiderQ.
 * Qué hace: pinta el banner bonito, registra comandos (chat y spider) con Commander,
 *           y arranca el flujo correcto. Se queda encendido hasta que se cierre el chat.
 */

import { Command } from 'commander';
import { showWelcome } from './ui';
import { chatLoop } from './loop';



// Hooks de diagnóstico: si algo raro pasa, lo verás en consola.
// Útiles en desarrollo; si molestan, simplemente coméntalos.
if (process.env.NODE_ENV === 'development') {
	process.on('beforeExit', (code) => console.log('[diag] beforeExit', code));
	process.on('exit', (code) => console.log('[diag] exit', code));
	process.on('uncaughtException', (err) => console.error('[diag] uncaughtException', err));
	process.on('unhandledRejection', (reason) => console.error('[diag] unhandledRejection', reason));
}


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
	.description('Iniciar chat interactivo')
	.action(() => {
		// Se retorna la promesa para que Commander no cierre el proceso
		return (async () => {
			return chatLoop(); // el loop queda funcionando hasta exit / Ctrl+C
		})();
	});



// Se ejecuta parseAsync sin top-level await (evita warning)
void (async () => {
	try {
		await program.parseAsync(process.argv);
	} catch (err: any) {
		console.error(err?.message || err);
		process.exitCode = 1; // deja el código de salida sin tumbar de golpe el proceso
	}
})();
