# Percata — Frontend

A personal catalogue for tracking movies, books and recipes — inspired by Letterboxd.

**Live:** https://percata-frontend.vercel.app

## Current scope (v1)

The public demo is a **read-only catalogue**: browse, search, filter by genre, sort by
year, paginate, and toggle dark mode.

Authentication is **disabled in v1**. The backend currently exposes Devise HTML
sessions only, while this client was written for a JSON/JWT flow. Rather than ship a
broken login, the public demo is anonymous. JWT auth and per-user lists are the next
milestone — the code is still in the repo (`AuthContext.js`, `LoginPage.js`,
`PrivateRoute.js`, `ProfilePage.js`) and is not wired into the public UI yet.

## Tech stack

- React 19
- React Router DOM v7
- Vanilla CSS
- Context API for auth state (present, not used in v1)

## Getting started

### 1. Start the backend

```bash
git clone https://github.com/Kazybek10/percata
cd percata
bin/rails db:prepare
bin/rails server -p 3001
```

The Rails API must run on **port 3001**, because the frontend runs on 3000.

### 2. Configure the frontend

```bash
npm install
cp .env.example .env
```

`.env`:

```bash
REACT_APP_API_URL=http://localhost:3001
```

### 3. Run the app

```bash
npm start
```

Open http://localhost:3000.

## API contract

| Endpoint | Returns |
| --- | --- |
| `GET /movies.json` | array of movies |
| `GET /books.json` | array of books |
| `GET /recipes.json` | array of recipes |
| `GET /movies/:id.json` | one movie |
| `GET /books/:id.json` | one book |
| `GET /recipes/:id.json` | one recipe |

Recipes have no `genre`, `description` or year fields in the database, so the UI
hides those elements when they are absent.

## Scripts

```bash
npm start      # development server on :3000
npm test       # unit tests
npm run build  # production build
```

## Roadmap

- JWT authentication and protected routes
- Per-user lists (want / watched / rating)
- Server-side pagination instead of loading the full catalogue
- Component tests for the catalogue and detail pages

---

Built by [Kazybek Nurlanbek](https://github.com/Kazybek10) · Amsterdam
