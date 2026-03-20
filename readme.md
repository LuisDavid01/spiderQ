# SpiderQ

> Agente conversacional de pentest web - 100% local

[English version](readmeen.md)

## Funcionalidades

- Agente conversacional con IA
- Web Crawler
- Nmap, FFuf, Whois, CreateWordlist

## Instalación

### Linux (script automático)

```bash
chmod +x install.sh
./install.sh
```

Instala: Node.js, Bun, Nmap, FFuf, WhoIs, Go, Mermaid CLI.  
*No incluye Ollama ni llama.cpp (instalar por separado si es necesario).*

### Manual

```bash
git clone https://github.com/LuisDavid01/spiderQ
cd spiderQ
bun install
```

## Modelos Locales (Ollama / llama.cpp)

Corre el agente **100% offline** usando Ollama o cualquier servidor compatible con OpenAI API.

### Configuración

La configuración se guarda en `~/.spiderq/config.json`:

```json
{
  "provider": "local",
  "model": "llama3.2",
  "localUrl": "http://localhost:11434/v1"
}
```

> **Nota:** Por ahora la edición es manual. Edita el archivo JSON directamente.

### Proveedores disponibles

| Proveedor | Uso |
|-----------|-----|
| `openai` | API de OpenAI |
| `operrouter` | Proxy a múltiples modelos |
| `local` | Ollama / llama.cpp (puerto 11434 por defecto) |

## Configuración

1. Copiar `.env.example` → `.env`
2. Ejecutar `bun run db:push`

## Comandos

| Comando | Descripción |
|---------|-------------|
| `bun run chat` | Iniciar agente |
| `bun run dev` | Modo desarrollo |
| `bun run db:push` | Crear/migrar tablas SQLite |
| `bun run db:clean` | Limpiar base de datos |
| `bun run db:generate` | Generar migración |
| `bun run db:migrate` | Ejecutar migraciones |
| `bun run test` | Tests unitarios |
| `bun run eval` | Evaluar modelo LLM |
| `bun run dashboard` | Visualizar resultados |

## Proyectos

| Paquete | Descripción |
|---------|-------------|
| `apps/cli-client` | Interfaz CLI |
| `packages/core` | Nucleo del agente |
| `apps/tui` | Interfaz TUI |

## Tecnologías

- TypeScript / Bun
- Drizzle ORM + SQLite
- OpenAI-compatible API (soporta Ollama, llama.cpp, OpenAI, OpenRouter)
