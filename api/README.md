# Manga Tracker API

NestJS and Prisma API for tracking manga, manhwa, and manhua series. The API uses PostgreSQL and exposes CRUD operations for series, including a dedicated endpoint for changing the current chapter.

## Requirements

- Node.js and npm
- PostgreSQL

## Setup

From this directory:

```bash
npm install
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to a PostgreSQL connection string. The default local configuration expects:

```text
postgresql://manga_tracker:manga_tracker@localhost:5432/manga_tracker?schema=public
```

To create the expected local PostgreSQL role and database, run:

```bash
npm run db:local
```

This script requires PostgreSQL to be installed and available locally. It may require a system user with permission to run `sudo -u postgres`.

Apply migrations directly with:

```bash
npm run db:migrate:local
```

The API loads `.env` automatically. `PORT` controls the HTTP port and defaults to `3000`.

### Windows setup

The `db:local` script is written for Linux/macOS because it uses Bash and `sudo`. On Windows:

1. Install PostgreSQL and make sure the PostgreSQL service is running.
2. Create a PostgreSQL role named `manga_tracker` with password `manga_tracker` and a database named `manga_tracker` owned by that role. You can do this during installation, in pgAdmin, or with `psql`.
3. Copy the environment file in PowerShell:

	```powershell
	Copy-Item .env.example .env
	```

4. Confirm that `DATABASE_URL` in `.env` points to the local PostgreSQL instance, then apply the migration:

	```powershell
	npm run db:migrate:local
	```

The migration and application commands work from PowerShell, Command Prompt, Git Bash, or Windows Terminal. If using Git Bash, `npm run db:local` can also be used after PostgreSQL and the required permissions are configured.

### Remote database

Set `DATABASE_TARGET=remote` and provide `REMOTE_DATABASE_URL`. For Prisma migrations, also provide `REMOTE_DIRECT_URL` when the remote provider uses a separate direct connection. Then run:

```bash
npm run db:migrate:remote
npm run start:remote
```

Keep remote connection strings out of source control.

## Running the API

```bash
# Development
npm run start:dev

# Production build and start
npm run build
npm run start:prod
```

The API is available at `http://localhost:3000` by default. CORS is enabled for the API server.

## API

All responses use the response body directly; there is no `{ data: ... }` wrapper.

### Series values

`type` must be one of:

- `MANGA`
- `MANHWA`
- `MANHUA`

`status` must be one of:

- `READING`
- `PLAN_TO_READ`
- `ON_HOLD`
- `DROPPED`
- `COMPLETED`

### `GET /series`

Returns all series ordered by `updatedAt` descending. Pass `status` to filter the result:

```text
GET /series?status=READING
```

The `sort=updatedAt` query is accepted and uses the same descending `updatedAt` order. Other sort values also currently fall back to this order.

### `GET /series/:id`

Returns one series. A missing ID returns `404 Not Found`.

### `POST /series`

Creates a series and returns the created record.

```json
{
	"title": "Example Series",
	"altTitle": "Optional alternate title",
	"type": "MANGA",
	"status": "READING",
	"currentChapter": 12,
	"totalChapter": 50,
	"rating": 8,
	"notes": "Read on weekends",
	"coverUrl": "https://example.com/cover.jpg",
	"sourceUrl": "https://example.com/series"
}
```

Required fields are `title` and `type`. `status` defaults to `PLAN_TO_READ`, and `currentChapter` defaults to `0`. The other fields are optional. `currentChapter`, `totalChapter`, and `rating` must be integers greater than or equal to `0`.

### `PATCH /series/:id`

Updates any subset of the create fields and returns the updated record. A missing ID returns `404 Not Found`.

```json
{
	"status": "COMPLETED",
	"rating": 9
}
```

### `PATCH /series/:id/bump`

Changes `currentChapter` and returns the updated record.

```json
{
	"amount": 5
}
```

If the body is omitted, `amount` defaults to `1`. Negative amounts are allowed, but the resulting chapter is never below `0`. The API does not prevent the current chapter from exceeding `totalChapter`.

### `DELETE /series/:id`

Deletes a series and returns `204 No Content`. A missing ID returns `404 Not Found`.

## Series response shape

```json
{
	"id": "generated-uuid",
	"title": "Example Series",
	"altTitle": null,
	"type": "MANGA",
	"status": "PLAN_TO_READ",
	"currentChapter": 0,
	"totalChapter": null,
	"rating": null,
	"notes": null,
	"coverUrl": null,
	"sourceUrl": null,
	"createdAt": "2026-09-05T12:00:00.000Z",
	"updatedAt": "2026-09-05T12:00:00.000Z"
}
```

Invalid request bodies return `400 Bad Request`. Unknown body properties are removed by the global validation pipe.

## Useful commands

```bash
npm test              # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
npm run lint          # Oxlint
npm run format        # Format TypeScript files
```

Prisma migrations are stored in `prisma/migrations`. The generated Prisma client is stored in `src/generated/prisma`.
