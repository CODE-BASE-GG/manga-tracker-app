# Phase 4 — Stretch Goals (v3)

Goal: the "if I'm still having fun with this" phase. Each item here is independent — pick whichever sounds most interesting, none of them depend on each other except where noted.

Prerequisite: Phase 2 MVP complete at minimum. Phase 3 recommended but not strictly required for most of these.

---

## 1. Cover image + metadata autofill (AniList or MangaDex API)

- [ ] Pick one: AniList has a public GraphQL API, MangaDex has a public REST API — either works, AniList's GraphQL is arguably nicer for fetching exactly the fields you want in one query
- [ ] New backend endpoint, e.g. `GET /series/search-external?q=title` — proxy the request server-side rather than calling from the frontend directly (avoids CORS headaches and keeps API keys, if any, off the client)
- [ ] In the Add Series form: search-as-you-type against this endpoint, show matching results with cover thumbnails
- [ ] Selecting a result autofills `title`, `altTitle`, `coverUrl`, and possibly `totalChapters` if the external API reports it (many ongoing series won't have this)
- [ ] Still allow fully manual entry — external search should be an assist, not a requirement (some obscure series won't be indexed)
- [ ] Rate limiting consideration: don't fire a request on every keystroke, debounce the search input

---

## 2. "Currently reading" homepage widget

- [ ] A compact section showing the 3–5 most recently updated `READING` status series
- [ ] Essentially a filtered/limited version of the existing list view — reuse the list item component rather than building a new one
- [ ] Placement: top of the main page, above the full list/filter section
- [ ] Purely derived from existing data — no schema or endpoint changes needed if `sort=updatedAt` already works from Phase 3

---

## 3. Reminder system ("not updated in 2 weeks")

- [ ] Depends on: `updatedAt` field (already exists) — no schema change strictly needed for a basic version
- [ ] v1 of this feature: purely client-side, computed on load — flag any `READING` status series where `updatedAt` is more than X days old (make X configurable, default 14)
- [ ] Display as a badge/banner on the affected list items ("Haven't touched this in 3 weeks")
- [ ] Stretch-of-the-stretch: actual push/email notifications — this requires a backend job scheduler (`@nestjs/schedule`) and a notification channel (email via nodemailer, or browser push) — significant added complexity, only worth it if you actually want to be nagged outside the app itself
- [ ] Recommendation: build the in-app badge version first, evaluate whether you actually check the app often enough for it to matter before building real notifications

---

## 4. Export/import JSON backup

- [ ] New endpoint: `GET /series/export` — returns full series list as a downloadable JSON file
- [ ] New endpoint: `POST /series/import` — accepts a JSON array, bulk-creates rows
- [ ] Import edge cases to decide:
  - [ ] Duplicate detection: match on `title`? Skip duplicates or allow them?
  - [ ] Partial failure handling: if row 47 of 100 is malformed, does the whole import fail or does it skip-and-continue?
- [ ] Frontend: simple "Export" button (triggers file download) and "Import" button (file picker → POST)
- [ ] This is genuinely useful even outside "stretch goal" framing — worth prioritizing higher if you're nervous about losing data during development

---

## 5. `ReadingLog` model — chapter history tracking

This is the biggest structural addition in Phase 4 — evaluate whether you actually want it before starting, since it changes how "bump chapter" works under the hood.

- [ ] New Prisma model:
  ```
  model ReadingLog {
    id        Int      @id @default(autoincrement())
    seriesId  Int
    series    Series   @relation(fields: [seriesId], references: [id])
    chapter   Float
    readAt    DateTime @default(now())
  }
  ```
- [ ] New migration, adds relation to `Series`
- [ ] Update the `PATCH /series/:id/bump` endpoint to also write a `ReadingLog` row on every bump (in the same transaction as the `currentChapter` update — use `prisma.$transaction`)
- [ ] New endpoint: `GET /series/:id/history` — returns the log entries for a series
- [ ] Frontend: simple line/step chart or plain list of "Chapter X — read on [date]" on a series detail view
- [ ] This unlocks: accurate "reading pace" stats, a real history graph, and more accurate reminder logic (based on actual read events, not just `updatedAt` which can also change from unrelated edits like notes)
- [ ] Trade-off to weigh: this adds a write on every single chapter bump, which is your most-used action — keep the write lightweight (it is, it's one row insert) and make sure it doesn't slow down the optimistic UI update from Phase 2

---

## Suggested order if doing multiple

If picking more than one, a reasonable order is: **Export/import first** (cheap, high value, protects your data) → **Currently reading widget** (cheap, reuses existing components) → **Reminder badges** (cheap, no schema change) → **Cover autofill** (moderate effort, most "wow factor") → **ReadingLog** (highest effort, only worth it if you want real history/stats).

---

## Exit criteria for Phase 4

There isn't really a hard finish line here — this phase ends whenever you decide it does. A reasonable "done for now" checkpoint:
- [ ] At least one stretch feature fully working end-to-end (not half-implemented)
- [ ] Data export works, giving you a safety net regardless of what else gets built
- [ ] Any schema changes made here have been migrated cleanly with no leftover dev data corruption
