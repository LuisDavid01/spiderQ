/**
 * Archivo: src/cli/loop.ts
 * Qué es: el bucle de conversación del CLI (modo chat).
 * Qué hace: pide texto al usuario, llama al agente, imprime la respuesta
 *           y se mantiene abierto hasta que escribas "exit"/"salir" o uses Ctrl+C.
 */

import readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

import { runAgent } from '../agent';
import { tags, printTip } from './ui';
import { tools } from '../tools/index';



// Wrapper de readline.question para pedir una línea y resolver con el texto.
// Cierra el readline al recibir la respuesta.
function requestUserInput(query: string): Promise<string> {
  const rl = readline.createInterface({ input, output, terminal: true });

  // Ctrl+C en medio de la pregunta(Solo HINT)
  rl.on('SIGINT', () => {
	   output.write('\nEscribe "exit" o "salir" para terminar.\n');
      });

  return new Promise((resolve) => {
    rl.question(query, (ans) => {
      rl.close(); 
      resolve((ans ?? '').trim());
    });
  });
}

export async function chatLoop(): Promise<void> {
  // Si estamos en una TTY, se asegura de mantener stdin "despierto".
  if (process.stdin.isTTY) process.stdin.resume();

  printTip('Escribe "exit" o "salir" para terminar.\n');



  // Loop principal del chat: se sale solo con "exit"/"salir"/"quit".
  while (true) {
    const q = await requestUserInput(`${tags.user}: `);

    // Salida limpia cuando el usuario lo pida.
    if (/^(exit|salir|quit)$/i.test(q)) {
      output.write('\nHasta luego 👋\n');
      break;
    }

    // Enter vacío → volvemos a preguntar sin molestar.
    if (!q) continue;

    try {
      // Enviamos el turno al agente
      const ans = await runAgent({ userMessage: q, tools });
      output.write(`${tags.assistant}: ${ans}\n\n`);
    } catch (err: any) {
      output.write(`Error en el agente: ${err?.message || String(err)}\n`);
    }
  }
}
