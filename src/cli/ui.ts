/**
 * Archivo: src/cli/ui.ts
 * Qué es: helpers visuales del CLI (banner, tips y etiquetas de roles).
 * Qué hace: pinta el banner con figlet+gradient, muestra tips con estilo
 *           y expone etiquetas de "Tú / SpiderQ / Tool" para el chat.
 */

import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';

// Banner de bienvenida
export function showWelcome() {
  // Figlet + gradiente para el título
  const title = gradient.vice(
    figlet.textSync('SPIDERQ', { horizontalLayout: 'fitted' })
  );
  console.log(title);

  // Subtítulo simple
  const subtitle = `${chalk.cyan('SpiderQ')} ${chalk.white('•')} ${chalk.white('CLI Pentest Assistant')}`;
  console.log(subtitle, '\n');

  // Caja compacta con un tip útil
  console.log(
    boxen(
      `${chalk.bold('SpiderQ  •  Chat (CLI)')}\n` +
        `${chalk.dim('Tip: usa ')}${chalk.yellow('/spider URL')} ${chalk.dim('para demo de subdirectorios')}`,
      {
        padding: 1,        // un poco de aire para que no se vea apretado
        borderColor: 'cyan',
        borderStyle: 'round'
      }
    )
  );
}

// Tip cortito, grisecito… para no gritar en consola
export function printTip(text: string) {
  console.log(chalk.dim('➜ ' + text));
}

// Etiquetas de rol para el prompt y las respuestas del chat
// (si mañana cambias los colores, lo haces acá y aplica en todo lado)
export const tags = {
  user: chalk.bold.blue('Tú'),          // prompt del usuario
  assistant: chalk.bold.magenta('SpiderQ'), // respuestas del asistente
  tool: chalk.bold.yellow('Tool')       // trazas de herramientas (si las muestras)
};
