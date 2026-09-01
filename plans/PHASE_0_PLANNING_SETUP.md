# Phase 0 — Planning & Setup

Goal: nothing "feature-y" gets built yet. This phase exists so Phase 1 isn't full of half-decisions. By the end, you should have two empty-but-running projects wired together and a locked schema on paper.

---

## 1. Lock the Prisma schema fields (on paper first)

Go field by field and decide type + optional/required + default before writing any Prisma code.

| Field | Type | Required? | Notes |
|---|---|---|---|
| `id` | Int/autoincrement or `cuid()` | required | pick one convention and stick to it project-wide |
| `title` | String | required | primary display name |
| `altTitle` | String | optional | EN/KR/romanized alt name |
| `type` | Enum (`MANGA`, `MANHWA`, `MANHUA`) | required | affects reading direction, display only for now |
| `status` | Enum (`READING`, `PLAN_TO_READ`, `ON_HOLD`, `DROPPED`, `COMPLETED`) | required | default `PLAN_TO_READ` |
| `currentChapter` | Float or Int | required | Float if you want to support "ch 12.5" specials, Int if not — **decide now** |
| `totalChapters` | Int | optional | null = ongoing/unknown |
| `rating` | Int | optional | 1–10 or 1–5, decide scale now |
| `notes` | String (Text) | optional | free text |
| `coverUrl` | String | optional | just a URL string for v1, no file upload |
| `sourceUrl` | String | optional | link to the site you read it on |
| `createdAt` | DateTime | auto (`@default(now())`) | |
| `updatedAt` | DateTime | auto (`@updatedAt`) | this is what powers "sort by last updated" later |

**Decisions to make before Phase 1:**
- [ ] `currentChapter`: Int or Float?
- [ ] Rating scale: 1–5 or 1–10, or skip for now and add in Phase 3?
- [ ] `id` strategy: autoincrement int vs cuid/uuid?

---

## 2. Enums

Define exactly as Prisma enums (all-caps convention, standard for Prisma):

```
enum SeriesType {
  MANGA
  MANHWA
  MANHUA
}

enum SeriesStatus {
  READING
  PLAN_TO_READ
  ON_HOLD
  DROPPED
  COMPLETED
}
```

- [ ] Confirm no other statuses needed (e.g. "Re-reading"? Skip for v1 — add later if you actually want it)

---

## 3. Scaffold NestJS project

- [ ] `nest new manga-tracker-api` (choose npm or pnpm, be consistent with frontend choice)
- [ ] Confirm it runs on default port (3000) — decide if you'll move API to 3001 to leave room for React on 3000
- [ ] Clean out the default boilerplate `AppController`/`AppService` example route
- [ ] Set up `.env` with `DATABASE_URL` for SQLite (e.g. `file:./dev.db`)
- [ ] Add `.gitignore` entries: `node_modules`, `.env`, `dev.db`, `dist`

---

## 4. Scaffold React project

- [ ] `npm create vite@latest manga-tracker-web -- --template react-ts` (TS recommended even for a bored weekend project — Prisma types will pair nicely with a typed frontend)
- [ ] Clean out default Vite boilerplate (logo, counter demo)
- [ ] Decide routing needs now: do you need React Router for a Detail page, or is list + modal enough for v1? (Recommendation: skip router in v1, use a modal/drawer for add/edit — one less dependency)
- [ ] Decide styling approach now so you're not fiddling with it mid-build: plain CSS, Tailwind, or a component lib? (No wrong answer — pick based on what you want practice with)

---

## 5. Install & initialize Prisma

- [ ] `npm install prisma --save-dev` and `npm install @prisma/client` in the NestJS project
- [ ] `npx prisma init --datasource-provider sqlite`
- [ ] Confirm `schema.prisma` points at `env("DATABASE_URL")` and provider is `sqlite`
- [ ] Write the `Series` model + enums into `schema.prisma` using the fields locked in section 1

---

## 6. Wire Prisma into NestJS

- [ ] Create `PrismaModule` + `PrismaService` (standard Nest+Prisma pattern: `PrismaService extends PrismaClient implements OnModuleInit`)
- [ ] Register `PrismaModule` as a global module so it doesn't need re-importing everywhere
- [ ] Sanity check: inject `PrismaService` into `AppService` temporarily and confirm `prisma.$connect()` works without errors

---

## Exit criteria for Phase 0

You're done with this phase when:
- [ ] `schema.prisma` has the final `Series` model + enums, committed
- [ ] `npx prisma migrate dev` runs clean with no schema changes pending
- [ ] NestJS app boots with `PrismaService` injectable and connected
- [ ] React app boots to a blank/default page
- [ ] Both repos (or one monorepo — your call, not decided above, so decide it here) are initialized with git

**Decision not yet made — settle before Phase 1:** monorepo (single git repo, `/api` and `/web` folders) vs. two separate repos. For a solo bored-weekend project, monorepo is simpler to manage.
