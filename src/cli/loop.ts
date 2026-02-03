/**
 * Archivo: src/cli/loop.ts
 * Qué es: el bucle de conversación del CLI (modo chat).
 * Qué hace: pide texto al usuario, llama al agente, imprime la respuesta
 *           y se mantiene abierto hasta que escribas "exit"/"salir" o uses Ctrl+C.
 */

import { runAgent } from '../agent';
import { tags, printTip } from './ui';
import { logErrorLocal } from '../utils/logs';
import { ReadlineManager } from './readline-manager';
import { tools } from '../tools/index';


export async function chatLoop(): Promise<void> {
  const readlineManager = ReadlineManager.getInstance();

  printTip('Escribe "exit" o "salir" para terminar.\n');
  readlineManager.setPrompt(`${tags.user}: `);

  return new Promise((resolve) => {
    readlineManager.startPersistentLoop(
      async (input) => {
        if (!input) return;

        try {
          const ans = await runAgent({ userMessage: input, tools });
          console.log(`${tags.assistant}: ${ans}\n`);
        } catch (err: any) {
			await logErrorLocal(`Error en el loop del agente: ${err.message}, stack trace:\n ${err.stack?.split('\n').slice(0, 5)}`)
          console.log(`Error en el agente: ${err?.message}`);
        }
      },
      () => {
        console.log('\nHasta luego 👋\n');
        readlineManager.close();
        resolve(); // 👈 ESTO mantiene vivo el proceso
      }
    );
  });
}

			

