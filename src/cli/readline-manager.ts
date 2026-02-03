/**
 * Archivo: src/cli/readline-manager.ts
 * Qué es: gestor único y persistente de readline para toda la sesión CLI.
 * Qué hace: proporciona una instancia singleton de readline con métodos para
 *           preguntas únicas y loop persistente, evitando múltiples creaciones/destrucciones.
 */

import readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

export class ReadlineManager {
	private static instance: ReadlineManager;
	private rl: readline.Interface | null = null;
	private isPersistent = false;

	private constructor() {
		// Privado para singleton
	}

	static getInstance(): ReadlineManager {
		if (!ReadlineManager.instance) {
			ReadlineManager.instance = new ReadlineManager();
		}
		return ReadlineManager.instance;
	}

	/**
	 * Inicializa la interfaz readline si no existe
	 */
	private ensureInterface(): readline.Interface {
		if (!this.rl) {
			this.rl = readline.createInterface({
				input,
				output,
				terminal: true
			});

			// Manejar Ctrl+C de forma consistente
			this.rl.on('SIGINT', () => {
				if (!this.isPersistent) {
					output.write('\n⚠️  Usa "exit" o "salir" para terminar.\n');
				}
			});
		}
		return this.rl;
	}

	/**
	 * Realiza una pregunta única y resuelve con la respuesta
	 * No cierra la interfaz (para permitir reutilización)
	 */
	askOnce(question: string): Promise<string> {
		const rl = this.ensureInterface();

		return new Promise((resolve) => {
			rl.question(question, (ans) => {
				resolve((ans ?? '').trim());
			});
		});
	}

	/**
	 * Inicia un loop persistente que procesa cada línea de entrada
	 * El callback se ejecuta por cada línea que ingresa el usuario
	 */
	startPersistentLoop(
		onInput: (line: string) => Promise<void> | void,
		onExit: () => void
	): void {
		const rl = this.ensureInterface();
		this.isPersistent = true;

		rl.prompt();

		rl.on('line', async (line) => {
			const trimmed = line.trim();

			if (/^(exit|salir|quit)$/i.test(trimmed)) {
				onExit();
				return;
			}

			await onInput(trimmed);
			rl.prompt();
		});
	}

	/**
	 * Cambia el prompt del readline
	 */
	setPrompt(prompt: string): void {
		const rl = this.ensureInterface();
		rl.setPrompt(prompt);
	}

	/**
	 * Limpia la línea actual y muestra nuevo prompt
	 */
	refreshPrompt(): void {
		const rl = this.ensureInterface();
		if (this.isPersistent) {
			rl.prompt();
		}
	}

	/**
	 * Cierra la interfaz readline y limpia recursos
	 */
	close(): void {
		if (this.rl) {
			this.rl.close();
			this.rl = null;
			this.isPersistent = false;
		}
	}

	/**
	 * Verifica si el readline está en modo persistente
	 */
	isInPersistentMode(): boolean {
		return this.isPersistent;
	}
}
