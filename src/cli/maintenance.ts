/**
 * Archivo: src/cli/maintenance.ts
 * Qué es: un pequeño “limpiador” de `db.json`.
 * Qué hace: recorta el historial para que no se dispare el tamaño del archivo
 *           (y de paso evitas gastar tokens de más o terminar con el JSON corrupto).
 * Cómo lo usa el CLI: lo llamamos al iniciar y después de cada turno del chat.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

// Ruta al db.json en la raíz del proyecto
const DB_PATH = path.resolve(process.cwd(), 'db.json');

// Parámetros sencillos de control
const MAX_MESSAGES = 60;            // nos quedamos con los últimos N mensajes
const HARD_MAX_BYTES = 200 * 1024;  // si el JSON supera ~200KB, aplicamos tijera dura
const HARD_KEEP = 30;               // deja solo los últimos 30

type DbShape = {
  messages?: Array<any>;
  [k: string]: any;
};

export async function cleanDbIfNeeded() {
  try {
    // Si no hay archivo, no hacemos nada
    const stat = await fs.stat(DB_PATH).catch(() => null);
    if (!stat) return;

    // Leemos el JSON tal cual
    const buf = await fs.readFile(DB_PATH, 'utf8');

    let data: DbShape;
    try {
      // Si está vacío o raro, cae al catch y reiniciamos
      data = JSON.parse(buf || '{}');
    } catch {
      // Si se corrompió el JSON, lo reseteamos a lo mínimo para seguir operando
      data = { messages: [] };
    }

    // Aseguramos que `messages` sea un array (si no, lo inicializamos vacío)
    if (!Array.isArray(data.messages)) data.messages = [];

    // Recorte por cantidad de mensajes (esto evita historiales eternos)
    if (data.messages.length > MAX_MESSAGES) {
      data.messages = data.messages.slice(-MAX_MESSAGES); // nos quedamos con lo más reciente
    }

    // Recorte por tamaño del archivo (medimos el JSON ya serializado)
    if (Buffer.byteLength(JSON.stringify(data), 'utf8') > HARD_MAX_BYTES) {
      data.messages = data.messages.slice(-HARD_KEEP); // tijera más agresiva
    }

    // Guardamos “compactado” (sin espacios ni saltos) para ocupar menos
    await fs.writeFile(DB_PATH, JSON.stringify(data), 'utf8');
  } catch {
  }
}
