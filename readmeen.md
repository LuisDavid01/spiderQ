# SpiderQ

> Web pentesting conversational agent - 100% local

## Features

- AI conversational agent
- Web Crawler
- Nmap, FFuf, Whois, CreateWordlist

## Installation

### Linux (automatic script)

```bash
chmod +x install.sh
./install.sh
```

Installs: Node.js, Bun, Nmap, FFuf, WhoIs, Go, Mermaid CLI.  
*Does not include Ollama or llama.cpp (install separately if needed).*

### Manual

```bash
git clone https://github.com/LuisDavid01/spiderQ
cd spiderQ
bun install
```

## Local Models (Ollama / llama.cpp)

Run the agent **100% offline** using Ollama or any OpenAI API-compatible server.

### Configuration

Settings are stored in `~/.spiderq/config.json`:

```json
{
  "provider": "local",
  "model": "llama3.2",
  "localUrl": "http://localhost:11434/v1"
}
```

> **Note:** For now, configuration must be edited manually. Edit the JSON file directly.

### Available Providers

| Provider | Description |
|----------|-------------|
| `openai` | OpenAI API |
| `operrouter` | Multi-model proxy |
| `local` | Ollama / llama.cpp (port 11434 by default) |

## Configuration

1. Copy `.env.example` → `.env`
2. Run `bun run db:push`

## Commands

| Command | Description |
|---------|-------------|
| `bun run chat` | Start agent |
| `bun run dev` | Development mode |
| `bun run db:push` | Create/migrate SQLite tables |
| `bun run db:clean` | Clean database |
| `bun run db:generate` | Generate migration |
| `bun run db:migrate` | Run migrations |
| `bun run test` | Unit tests |
| `bun run eval` | Evaluate LLM model |
| `bun run dashboard` | View results |

## Projects

| Package | Description |
|---------|-------------|
| `apps/cli-client` | CLI interface |
| `packages/core` | Agent core |
| `apps/tui` | TUI interface |

## Tech Stack

- TypeScript / Bun
- Drizzle ORM + SQLite
- OpenAI-compatible API (supports Ollama, llama.cpp, OpenAI, OpenRouter)
