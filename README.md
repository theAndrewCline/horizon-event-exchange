# Horizon Event Exchange

A real-time event exchange platform for streaming and processing events.

## Prerequisites

- [Bun](https://bun.sh/) v1.3.8 or later
- [Docker](https://www.docker.com/) and Docker Compose (for containerized setup)


## Local Development

Install dependencies:
```bash
bun install
```

All packages have dev scripts that watch files for changes and live update:

```bash
bun run dev
```

## Docker Development

For containerized development with all services:

1. Build and start all services:
```bash
docker-compose up --build
```

2. Services will be available at:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000
   - Generator service (connects to backend)

3. To stop services:
```bash
docker-compose down
```

## Design Philosophy

This project follows [Clean Code Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html):

- **Entities**: Core business objects (Assets)
- **Use Cases**: Business logic and CRUD operations
- **Interface Adapters**: WebSockets, database controllers, UI components

## Architecture Decisions

**Core Implementation**: Started with Zod schemas for Asset entities, then implemented CRUD use cases. Made a tradeoff to directly use SQLite instead of creating a database controller interface (easily refactored).

**Communication Layer**: Created a message protocol using Zod schemas for type-safe WebSocket communication.

**Service Integration**: Built WebSocket server, event generator, and React frontend, all connected through the shared message protocol.
