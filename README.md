# SpiderQ - Web Crawler AI Agent

> **Totalmente gratis - Corrélo localmente en tu máquina**

Un agente conversacional especializado en pentest web que podés ejecutar gratis en tu computadora.

## Funcionalidades

-  **Agente conversacional** con especialización en pentest web
-  **Crawler** - Extrae todos los enlaces de un sitio web recursivamente
-  **Nmap** - Escaneo de puertos y servicios
-  **CreateWordlist** - Genera wordlists para fuzzing
-  **FFuf** - Fuzzing de directorios y archivos
-  **Whois** - Información de dominios

## Setup

```bash
git clone https://github.com/LuisDavid01/spiderQ
cd spiderQ
npm install
# o si preferís pnpm:
pnpm install
```

## Configuración

1. Crea un archivo `.env` en la raíz del proyecto:
```bash
cp .env.example .env
```

2. Agrega tu API key de OpenAI:
```env
OPENAI_API_KEY=sk-tu-api-key-aqui
```

3. Configurá la base de datos SQLite:
```bash
pnpm db:push
```

Listo! Ya podés hablar con el agente.

## Cómo usarlo

```bash
pnpm chat
# o en modo desarrollo
pnpm dev
```

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm chat` | Iniciar conversación con el agente |
| `pnpm dev` | Modo desarrollo con reinicio automático |
| `pnpm db:push` | Crear/migrar tablas de SQLite |
| `pnpm db:clean` | Limpiar toda la base de datos |
| `pnpm db:generate` | Generar migración desde schema |
| `pnpm db:migrate` | Ejecutar migraciones pendientes |
| `pnpm test` | Ejecutar tests unitarios con Vitest |
| `pnpm eval` | Correr evaluaciones del LLM |
| `pnpm dashboard` | Visualizar resultados de evaluaciones |

## Tecnologías

- [OpenAI](https://openai.com) - Modelos de lenguaje
- [TypeScript](https://www.typescriptlang.org/) - Lenguaje
- [Drizzle ORM](https://orm.drizzle.team/) - ORM para SQLite
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - Base de datos local

## Recomendaciones

- Eliminá la base de datos periódicamente (`pnpm db:clean`) para no gastar tokens innecesarios
- Si hay errores raros o mensajes corruptos, ejecutá `pnpm db:clean` y reiniciá el agente
