/**
 * Archivo: src/cli/spiderDemo.ts
 * Qué es: una demo visual para el comando `spider <url>`.
 * Qué hace: imprime un resultado simulado (mock) de “subdirectorios encontrados”
 *           usando boxen/chalk para que veas el look&feel antes de conectar tools reales.
 */

import boxen from 'boxen';
import chalk from 'chalk';

export async function spiderDemo(url: string) {
  const found = ['/admin', '/uploads', '/api/v1', '/.git/'];

  // Título con la URL objetivo (que se note qué estamos “escaneando”)
  const title = chalk.bold(`Spider Demo → ${url}`);

  // Cuerpo: lista simple y un tip para el siguiente paso
  const body =
    `${chalk.gray('Encontrados (mock):')}\n` +
    found.map((p) => `  ${chalk.green('•')} ${p}`).join('\n') +
    `\n\n${chalk.dim('Tip: conecta aquí tu tool real desde src/tools/ y pásale la URL.')}`;

  // Se arma una cajita bonita para que el output no sea un muro de texto
  console.log(
    boxen(`${title}\n\n${body}`, {
      padding: 1,
      borderColor: 'green',
      borderStyle: 'round'
    })
  );
}
