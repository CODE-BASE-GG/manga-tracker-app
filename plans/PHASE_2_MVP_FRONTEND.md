# Phase 2 — MVP Frontend

Goal: a usable React UI wired to the Phase 1 API. By the end of this phase you have a real, end-to-end working tracker — this is the milestone that matters most.

Prerequisite: Phase 1 API running locally with all endpoints tested.

---

## 1. API client layer

- [x] Create a small `api/` folder or `services/seriesApi.ts` file — don't scatter raw `fetch()` calls through components
- [x] Base URL as an env var (`VITE_API_URL`) so it's not hardcoded — you'll thank yourself if the API port changes
- [x] Functions to implement: `getAllSeries(status?)`, `getSeriesById(id)`, `createSeries(dto)`, `updateSeries(id, dto)`, `deleteSeries(id)`, `bumpChapter(id, amount?)`
- [x] Decide error handling pattern now: throw and catch in components, or return a `{ data, error }` shape? (Recommendation: throw + try/catch, simpler for a small app)

---

## 2. Types

- [x] Mirror the Prisma `Series` model as a TypeScript type/interface on the frontend (`SeriesType`, `SeriesStatus` enums as string literal unions)
- [x] Keep this in a shared `types.ts` — avoids drift between what the API returns and what components expect

---

## 3. `useSeries` hook (or equivalent state layer)

- [x] Holds the list of series in state, exposes `refetch()`
- [x] Loading state (`isLoading`) — v1 doesn't need skeleton loaders, just a simple "Loading..." text is fine
- [x] Error state (`error`) — simple string/message is enough for v1
- [x] Decide: React Query/SWR now, or plain `useState` + `useEffect`? (Recommendation: plain hooks for v1 — this app doesn't need caching/revalidation complexity yet; revisit in Phase 3 if the manual refetch calls get annoying)

---

## 4. Series List view

- [x] Renders all series as cards or table rows — pick one layout, card grid probably reads nicer for cover images later
- [x] Each item shows: title, type badge, status badge, current chapter (and `/ totalChapters` if known)
- [x] Status filter — simple tab bar or dropdown: All / Reading / Plan to Read / On Hold / Dropped / Completed
- [x] Empty state: what shows when filter returns zero results? (Don't skip this — "No series yet, add one!" beats a blank white screen)
- [x] Each item is clickable/has an edit affordance (opens edit form — see section 6)

---

## 5. "+1 chapter" button — the most-used feature

- [x] Visible directly on each list item, no need to open the series first
- [x] On click: calls `bumpChapter(id)`, optimistically updates local state OR refetches — decide which (Recommendation: optimistic update for snappiness, since this is the button you'll click constantly)
- [x] Visual feedback on click (brief highlight/animation) so it's obvious the click registered
- [x] Debounce/disable the button briefly after click to prevent double-bumps from a fast double-tap

---

## 6. Add Series form

- [x] Fields: title (required), altTitle, type (select), status (select, default Plan to Read), totalChapters, coverUrl, sourceUrl, notes
- [x] Client-side validation: title required, totalChapters must be positive if provided
- [x] Submit → `createSeries()` → close form → refetch/update list
- [x] Decide UI pattern: separate page, modal, or slide-in drawer? [Modal]

---

## 7. Edit Series form

- [x] Same fields as Add, pre-filled with existing values
- [x] Also allows manually setting `currentChapter` directly (not just bumping) — needed for corrections, e.g. "actually I'm on chapter 40, not 12"
- [x] Submit → `updateSeries()` → refetch/update list

---

## 8. Delete flow

- [x] Delete action available from list item or edit form
- [x] Confirmation step required (native `confirm()` is fine for v1, doesn't need a custom modal)
- [x] On confirm → `deleteSeries()` → remove from local state/refetch

---

## 9. Basic layout & navigation

- [x] App shell: header/title + "Add Series" button always visible
- [x] Status filter bar below header
- [x] List fills the rest of the page
- [x] Responsive enough to not be broken on mobile width (doesn't need to be pixel-perfect, just usable)

---

## 10. Manual end-to-end testing checklist

- [x] Add a new series → appears in list immediately
- [x] Bump its chapter 3 times → count updates each time, no page reload needed
- [x] Edit a series's status → moves correctly when filter is applied
- [x] Delete a series → disappears from list, confirmation required first
- [x] Filter by each status → correct subset shown
- [x] Refresh the page → data persists (confirms it's reading from API, not just local state)

---

## Exit criteria for Phase 2 — **this is the MVP milestone**

- [x] Every Phase 1 endpoint is used somewhere in the UI
- [x] You can go from "empty database" to "tracking 5 series with accurate chapter counts" using only the UI, zero direct DB/Postman intervention
- [x] No console errors during normal use
- [x] App survives a page refresh without losing data

At this point you have a genuinely usable personal tool. Phases 3–4 are polish and extras — treat MVP completion as a natural stopping point if you lose steam.
