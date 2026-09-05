# Manga/Manhwa Tracker
> tentative title :3
---
A personal tracker for manga, manhwa, and manhua. The current MVP lets you record series, track reading status and chapters, and update your list from a browser UI.

## Repository

This is a monorepo containing two applications:

- [`api/`](./api/) - NestJS REST API with Prisma and PostgreSQL
- [`web/`](./web/) - React and Vite frontend
- [`plans/`](./plans/) - implementation plans and future feature ideas

Detailed setup and API documentation is available in [`api/README.md`](./api/README.md) and [`web/README.md`](./web/README.md).

## Stack

- React 19 and Vite
- NestJS 12
- Prisma 7
- PostgreSQL
- TypeScript

The API uses PostgreSQL for both local and remote database targets. The original planning documents contain some older SQLite references; the implemented configuration is PostgreSQL.

## Current MVP

The API supports:

- Create, read, update, and delete series
- Filter series by reading status
- Increment or correct the current chapter
- Validation for request bodies and not-found responses
- Local and remote PostgreSQL migration targets

The web app supports:

- View series in a responsive card grid
- Filter by status
- Add and edit series
- Increment a chapter directly from a series card
- Delete with confirmation
- Loading, empty, form, and API error states

## Quick start

Install dependencies for the root workspace and both applications:

```bash
npm install
cd api && npm install
cd ../web && npm install
cd ..
```

Configure the API by following [`api/README.md`](./api/README.md). This includes PostgreSQL setup, migrations, and API environment variables.

Configure the frontend from its example environment file:

```bash
cp web/.env.example web/.env
```

The default frontend configuration expects the API at `http://localhost:3000`.

Once PostgreSQL is running and the API database has been migrated, start both applications from the repository root:

```bash
npm run dev
```

The API runs on `http://localhost:3000` by default. Vite normally serves the web app at `http://localhost:5173`.

For Windows setup details, see the Windows sections in the API and web READMEs.

## Root commands

```bash
npm run dev          # Start the API and web development servers
npm run dev:api      # Start only the API
npm run dev:web      # Start only the web app
npm run format       # Format API and web source files
npm run format:check # Check formatting without changing files
```

Application-specific commands, including builds, linting, migrations, and tests, are documented in the respective app README files.

## Data model

The current `Series` model contains:

`id`, `title`, `altTitle`, `type`, `status`, `currentChapter`, `totalChapter`, `rating`, `notes`, `coverUrl`, `sourceUrl`, `createdAt`, and `updatedAt`.

Supported types are `MANGA`, `MANHWA`, and `MANHUA`. Supported statuses are `READING`, `PLAN_TO_READ`, `ON_HOLD`, `DROPPED`, and `COMPLETED`.

`ReadingLog` is a proposed future model and is not currently implemented.

## Roadmap

1. [Phase 0 - Planning and Setup](./plans/PHASE_0_PLANNING_SETUP.md) - Implemented
2. [Phase 1 - MVP Backend](./plans/PHASE_1_MVP_BACKEND.md) - Implemented
3. [Phase 2 - MVP Frontend](./plans/PHASE_2_MVP_FRONTEND.md) - Implemented
4. [Phase 3 - Quality of Life](./plans/PHASE_3_QUALITY_OF_LIFE.md) - Planned
5. [Phase 4 - Stretch Goals](./plans/PHASE_4_STRETCH_GOALS.md) - Planned

Phase 3 currently covers search, sorting options, progress indicators, surfaced notes, statistics, and UI polish. Phase 4 contains optional ideas such as export/import, external metadata lookup, reminders, and reading history.
