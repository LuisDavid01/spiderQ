/**
 * Archivo: src/config/globalConfig.ts
 * Qué es: sistema central de configuración global para SpiderQ.
 * Qué hace: carga config.json si existe, valida estructura, exporta funciones de acceso.
 */

import fs from 'node:fs';
import path from 'node:path';

export interface SpiderQConfig {
  provider: 'openai' | 'openrouter';
  model: string;
  apiKey: string;
  summaryModel: string;
}

let cachedConfig: SpiderQConfig | null = null;

export function loadConfig(): SpiderQConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const configPath = path.join(process.cwd(), 'config.json');
  
  // Si no existe, lanzar error para que el CLI lo maneje
  if (!fs.existsSync(configPath)) {
    throw new Error('NO_CONFIG');
  }
  
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(content);
    
    // Validar estructura completa
    if (!config.provider || !config.model || !config.apiKey || !config.summaryModel) {
      throw new Error('INVALID_STRUCTURE');
    }
    
    // Validar provider válido
    if (!['openai', 'openrouter'].includes(config.provider)) {
      throw new Error('INVALID_PROVIDER');
    }
    
    cachedConfig = config as SpiderQConfig;
    return cachedConfig;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('MALFORMED_JSON');
    }
    throw error;
  }
}

// Exportar CONFIG que carga en demanda
export const CONFIG = new Proxy({} as SpiderQConfig, {
  get(target, prop) {
    if (!cachedConfig) {
      loadConfig();
    }
    return (cachedConfig as any)[prop];
  }
});