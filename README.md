# Manga/Manhwa Tracker — Project Plan

A personal tracker for manga, manhwa, and manhua — solves the "wait, where did I stop on this one?" problem.

**Stack:** React + Prisma + NestJS (SQLite for local dev)

This plan is split into one README per phase. Work through them in order — each phase lists its prerequisites and exit criteria.

## Phases

1. [Phase 0 — Planning & Setup](./PHASE_0_PLANNING_SETUP.md)
2. [Phase 1 — MVP Backend](./PHASE_1_MVP_BACKEND.md)
3. [Phase 2 — MVP Frontend](./PHASE_2_MVP_FRONTEND.md) ← **MVP milestone**
4. [Phase 3 — Quality of Life (v2)](./PHASE_3_QUALITY_OF_LIFE.md)
5. [Phase 4 — Stretch Goals (v3)](./PHASE_4_STRETCH_GOALS.md)

## Core data model (summary)

**`Series`:** `id, title, altTitle?, type (enum), status (enum), currentChapter, totalChapters?, rating?, notes?, coverUrl?, sourceUrl?, createdAt, updatedAt`

**`ReadingLog`** (optional, Phase 4): `id, seriesId, chapter, readAt`

See individual phase docs for full field-by-field decisions and open questions.
