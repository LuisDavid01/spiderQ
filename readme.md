# SpiderQ

> Agente conversacional de pentest web - 100% local

## Funcionalidades

- Agente conversacional con IA
- Web Crawler
- Nmap, FFuf, Whois, CreateWordlist

## Instalación

```bash
git clone https://github.com/LuisDavid01/spiderQ
cd spiderQ
bun install
```

## Configuración

1. Copiar `.env.example` → `.env`
2. Agregar `OPENAI_API_KEY`
3. Ejecutar `bun run db:push`

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
- OpenAI API
