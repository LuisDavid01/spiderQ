

import { GlobalConfig } from '@spiderq/core/config';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';

// Banner de bienvenida
export function showWelcome() {
  // Figlet + gradiente para el título
  const title = gradient.vice(
    figlet.textSync('SPIDERQ', { horizontalLayout: 'fitted' })
  );
  console.log(title);

  // Subtítulo simple
  const subtitle = `${chalk.cyan('SpiderQ')} ${chalk.white('•')} ${chalk.white('CLI Pentest Assistant')} 
  ${chalk.yellow(GlobalConfig.provider)} ${chalk.white(GlobalConfig.model)}`;
  console.log(subtitle, '\n');
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
