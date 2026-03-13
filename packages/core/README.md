# @spiderq/core

> Núcleo del agente SpiderQ

## Instalación

```bash
bun install
```

## Setup para Desarrollo

1. Instalar dependencias: `bun install`
2. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Editar OPENAI_API_KEY
   ```
3. Inicializar DB: `bun run db:push`

## Scripts

| Script | Descripción |
|--------|-------------|
| `bun run db:push` | Crear tablas |
| `bun run db:seed` | Poblar datos |
| `bun run db:clean` | Limpiar DB |
| `bun run db:generate` | Generar migración |
| `bun run db:migrate` | Ejecutar migraciones |
| `bun test` | Tests unitarios |

## Módulos

- `agent.ts` - Agente principal
- `ai.ts` - Integración OpenAI
- `tools/` - Herramientas (crawler, nmap, etc.)
- `memory.ts` - Gestión de contexto
- `db/` - Schema y queries
