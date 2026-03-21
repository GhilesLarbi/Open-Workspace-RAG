# Open-Workspace-RAG

RAG platform — web crawling, vector search, LLM chat. Fully local, no external AI services.

## Project Overview

This is a monorepo with two main components:
- **API** (`/api`) - FastAPI backend with PostgreSQL, pgvector, Redis, and Ollama
- **Dashboard** (`/dashboard`) - Vite/React frontend with TypeScript and shadcn/ui

## Core Mandate: Local First — No Exceptions

Everything runs on-device. No calls to OpenAI, Anthropic, or any external AI API.
- LLM inference: Ollama (`http://ollama:11434` inside Docker, `http://localhost:11434` outside)
- Embeddings: Ollama (bge-m3, 1024 dims)
- Vector store: pgvector inside PostgreSQL
- **If a solution requires an external AI API, it is the wrong solution.**

## Tech Stack

| Component | Technology | Port |
|-----------|------------|------|
| Database | pgvector/pgvector:pg17 | 5432 |
| Redis | redis:7-alpine | 6379 |
| LLM | ollama/ollama | 11434 |
| API | FastAPI + TaskIQ (Python 3.12) | 8000 |
| Dashboard | Vite/React (pnpm) | 3000 |

## Docker Commands

- `docker compose up -d`: Start everything
- `docker compose up -d db redis ollama`: Start infra only
- `docker compose up -d --build <service>`: Rebuild and restart a specific service
- `docker compose logs -f <service>`: Tail logs
- `docker compose down`: Stop everything

## Development Workflow

- **Research:** Always check existing patterns in `api/` or `dashboard/` before implementing new features
- **Validation:** Always verify changes by running the relevant service in Docker
- **Testing:** Use Firefox MCP server for UI testing with `--marionette` flag

## Testing the Dashboard

1. Start services: `docker compose up -d`
2. Access dashboard at `http://localhost:3000`
3. Use Firefox with marionette for automated testing

## Code Standards

- Type everything: Full type annotations required
- Statelessness: API and worker must be stateless; persistent state only in DB/Redis
- Simplicity: No premature optimization or abstraction
- shadcn/ui: Don't gut primitive components; extend via `className`
