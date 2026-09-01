# Phase 3 — Quality of Life (v2)

Goal: make the tool nicer to actually live with day-to-day. Nothing here is required for the tracker to function — this is all about reducing friction once you have real data in it.

Prerequisite: Phase 2 MVP complete and in daily use for a bit (you'll notice which of these you actually want first).

---

## 1. Search & filter by title/genre

- [ ] Add a search input in the list view, filters by `title`/`altTitle` (client-side filtering is fine at this scale — no need for a backend search endpoint)
- [ ] Decide: add a `genre` field to the schema now (was deferred from Phase 0) — if yes:
  - [ ] Add `genres` as a String array field (`String[]` in Prisma, works natively with SQLite via Prisma's implicit handling) or a simple comma-separated string if you want to avoid relational complexity
  - [ ] New migration required
  - [ ] Add genre input (tag-style input or comma-separated text field) to Add/Edit forms
  - [ ] Add genre filter alongside status filter in list view

---

## 2. Sort by last updated

- [ ] Default list sort: `updatedAt` descending (most recently touched first) — likely what you want as the default view overall, worth reconsidering as the primary list order rather than an opt-in sort
- [ ] Add a sort dropdown: Last Updated / Title A-Z / Chapter Count
- [ ] Confirm backend `GET /series?sort=` param (built in Phase 1) actually supports whichever fields you expose here — extend it if not

---

## 3. Progress bar

- [ ] Only render when `totalChapters` is set (null totalChapters = ongoing series, no bar, just show current chapter as text)
- [ ] Simple `currentChapter / totalChapters` percentage, rendered as a horizontal bar or ring
- [ ] Edge case: `currentChapter > totalChapters` (can happen per the Phase 1 bump edge case) — cap the visual bar at 100% even if underlying number is higher

---

## 4. Notes field surfaced in UI

- [ ] Notes field already exists in schema/DTOs from Phase 0/1 — this phase is about actually exposing it well in the UI
- [ ] Show a notes preview/icon on list items when notes exist (don't dump full text into the compact list view)
- [ ] Full notes editable in the Edit form (already partially covered in Phase 2, confirm it's not just an afterthought input — give it a proper textarea)

---

## 5. Rating field

- [ ] If deferred from Phase 0, finalize the scale now (1–5 recommended, simpler UI as star icons)
- [ ] Only relevant/shown once a series is `COMPLETED` — decide whether to hide the rating input for non-completed series or just leave it always-available
- [ ] Migration if the field wasn't added in Phase 0

---

## 6. Basic stats view

- [ ] New simple page/panel, doesn't need its own route if you're avoiding router — a collapsible section on the main page works
- [ ] Stats to compute (all derivable client-side from the existing `GET /series` data, no new endpoints needed for v1):
  - [ ] Total series count
  - [ ] Total chapters read across everything (sum of `currentChapter`)
  - [ ] Count by status (how many Reading / Completed / Dropped etc.)
  - [ ] Series completed this year — requires checking `updatedAt` (or a dedicated `completedAt` field, decide if worth adding) against current year, only counts if `status === COMPLETED`
- [ ] Decide: `completedAt` timestamp field — the schema doesn't currently know *when* something was marked completed, only that it currently is. Add this now if "completed this year" stat should be historically accurate rather than just "currently completed."

---

## 7. Polish pass

- [ ] Loading skeletons instead of plain "Loading..." text (optional, purely cosmetic)
- [ ] Toast/snackbar feedback on actions (created, updated, deleted) instead of silent state changes
- [ ] Keyboard accessibility check on forms (tab order, enter-to-submit)
- [ ] Empty states reviewed for every filter combination, not just the "no series at all" case

---

## Exit criteria for Phase 3

- [ ] Search and sort both work and feel fast (client-side filtering shouldn't lag at personal-tracker scale)
- [ ] Progress bars render correctly for series with and without `totalChapters`
- [ ] Stats panel shows accurate numbers matching what's actually in the list
- [ ] No schema fields feel like "dead weight" — everything added in Phase 0/1 is now actually surfaced in the UI somewhere

**Carry-forward decision:** whether `completedAt` was added — this affects whether Phase 4's stretch reminder/history features have accurate timestamps to work with.
