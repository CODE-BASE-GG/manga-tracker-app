# Manga Tracker Web

React frontend for the Manga Tracker application. It uses Vite for development and production builds and communicates with the NestJS API in the sibling `api` directory.

## Requirements

- Node.js and npm
- A running Manga Tracker API

## Setup

From this directory:

```bash
npm install
```

Create a local environment file from the included example:

```bash
cp .env.example .env
```

`VITE_API_URL` is required. The frontend throws an error during startup when it is missing. Do not add a trailing slash; API paths such as `/series` are appended to this value.

### Windows setup

```powershell
Copy-Item .env.example .env
```

The npm commands below work from PowerShell, Command Prompt, Git Bash, or Windows Terminal.

## Development

Start the Vite development server:

```bash
npm run dev
```

Vite prints the local URL in the terminal, normally `http://localhost:5173`.

The API must be running separately, normally at `http://localhost:3000`. The API enables CORS for browser requests.

## Features

- View all tracked series in a responsive card grid
- Filter series by status: Reading, Plan to Read, On Hold, Dropped, or Completed
- Add a series with title, alternate title, type, status, chapter counts, rating, notes, cover URL, and source URL
- Edit an existing series
- Increment the current chapter by one
- Delete a series after confirmation
- Display loading, empty, and API error states

Supported series types are `MANGA`, `MANHWA`, and `MANHUA`.

## API integration

The frontend calls these API endpoints:

| Operation | Endpoint |
| --- | --- |
| List series, optionally filtered by status | `GET /series` |
| Create a series | `POST /series` |
| Update a series | `PATCH /series/:id` |
| Increment a chapter | `PATCH /series/:id/bump` |
| Delete a series | `DELETE /series/:id` |

Successful create, update, chapter bump, and delete operations trigger a list refresh. API errors are shown in the relevant loading, form, or delete-confirmation state.

## Commands

```bash
npm run dev      # Start the development server
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

There is currently no dedicated frontend test script in `package.json`.

## Project structure

```text
src/
	api/           API request functions
	components/    Series cards, forms, filters, and dialogs
	hooks/         Data-fetching hooks
	App.tsx        Main application view
	types.ts       Shared frontend data types
```
