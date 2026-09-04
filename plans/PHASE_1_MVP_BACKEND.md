# Phase 1 — MVP Backend

Goal: a working NestJS + Prisma API for `Series` CRUD, plus the dedicated "bump chapter" endpoint. No auth, no frontend yet — test everything via Thunder Client/Postman/curl.

Prerequisite: Phase 0 complete (schema locked, Prisma wired into Nest).

---

## 1. Migration

- [x] Run `npx prisma migrate dev --name init` to create the `Series` table from the schema
- [x] Open Prisma Studio (`npx prisma studio`) and manually confirm the table/columns look right
- [x] Manually insert 2–3 dummy rows in Studio for testing the GET endpoints before POST exists

---

## 2. Generate the Series module

- [x] `nest g module series`
- [x] `nest g controller series`
- [x] `nest g service series`
- [x] Confirm `SeriesModule` is imported into `AppModule`

---

## 3. DTOs (Data Transfer Objects)

Define request-shape validation before writing endpoint logic.

- [x] `CreateSeriesDto` — required: `title`, `type`, `status`; optional: `altTitle`, `currentChapter` (default 0), `totalChapters`, `coverUrl`, `sourceUrl`, `notes`
- [x] `UpdateSeriesDto` — same as create but all fields optional (use `PartialType(CreateSeriesDto)` from `@nestjs/mapped-types`)
- [x] `BumpChapterDto` — just `{ amount?: number }`, defaulting to `+1` if not provided (lets you later support "+5" for binge catch-up)
- [x] Install `class-validator` + `class-transformer`, add `@IsString()`, `@IsEnum()`, `@IsOptional()`, `@IsInt()`/`@IsNumber()` decorators on DTO fields
- [x] Enable global `ValidationPipe` in `main.ts` (`whitelist: true` to strip unknown fields)

---

## 4. Endpoints

### `GET /series`
- [x] Returns all series
- [x] Support optional query param `?status=READING` to filter server-side
- [x] Support optional query param `?sort=updatedAt` (desc by default) for the "recently touched" ordering
- [x] Decide: paginate now or later? Later. (Recommendation: skip pagination in v1 — a personal tracker won't have thousands of rows)

### `GET /series/:id`
- [x] Returns single series by id
- [x] Return 404 (`NotFoundException`) if id doesn't exist — decide this now so frontend error handling in Phase 2 has something real to work against - Note: Added.

### `POST /series`
- [x] Accepts `CreateSeriesDto`
- [x] Defaults `currentChapter` to 0 if not provided
- [x] Defaults `status` to `PLAN_TO_READ` if not provided
- [x] Returns the created row (with generated `id`, `createdAt`, `updatedAt`)

### `PATCH /series/:id`
- [x] Accepts `UpdateSeriesDto`
- [x] 404 if id doesn't exist
- [x] Returns the updated row

### `DELETE /series/:id`
- [x] 404 if id doesn't exist
- [x] Returns 204 or the deleted row (pick one, be consistent)

### `PATCH /series/:id/bump`
- [x] Accepts `BumpChapterDto` (`{ amount?: number }`, default `1`)
- [x] Increments `currentChapter` by `amount`
- [x] Touches `updatedAt` (automatic via Prisma `@updatedAt` on any update)
- [x] Edge case: what happens if bump pushes `currentChapter` past `totalChapters`? (Recommendation: allow it silently for v1 — don't block on it, some sites number chapters weirdly)
- [x] Edge case: negative `amount` allowed? (Recommendation: yes, lets you "undo" a misclick — just don't let it go below 0)

---

## 5. Error handling

- [x] Wrap not-found cases in Nest's built-in `NotFoundException`
- [x] Confirm `ValidationPipe` returns readable 400 errors on bad DTO input (e.g. invalid enum value)
- [x] Manually test: POST with missing `title` → expect 400, not a 500 crash

---

## 6. Manual testing checklist (via Postman/Thunder Client/curl)

- [x] Create a series → confirm row appears in Prisma Studio
- [x] List all series → confirm array shape matches expectations
- [x] Get one by valid id → 200
- [x] Get one by invalid id → 404
- [x] Update status from `PLAN_TO_READ` to `READING` → confirm `updatedAt` changed
- [x] Bump chapter with no body → chapter +1
- [x] Bump chapter with `{ "amount": 5 }` → chapter +5
- [x] Delete a series → confirm gone from list

---

## Exit criteria for Phase 1

- [x] All 6 endpoints implemented and manually tested
- [x] DTO validation rejects malformed input with 400s
- [x] Not-found cases return 404s, not 500s
- [x] You can fully create/read/update/bump/delete a series without touching Prisma Studio directly

**Not yet decided — carry into Phase 2:** exact JSON response shape (flat object vs. wrapped `{ data: ... }`) — pick one now so the frontend API client in Phase 2 isn't guessing.
