# Percata — Frontend

A personal catalogue for tracking movies, books, and recipes — inspired by Letterboxd.

**Live:** https://percata-frontend.vercel.app

## Tech Stack

- React 19
- React Router DOM v7
- Context API — global auth state
- JWT — authentication (no external auth library)
- Vanilla CSS

## Features

- Register / Login / Logout via JWT
- Protected routes — redirect to login if unauthenticated
- Dark / light mode with localStorage persistence
- Browse movies, books, recipes by tab
- Filter by genre
- Sort by year (newest / oldest)
- Pagination (8 items per page)
- Global search across all categories
- User profile page
- 404 page

## Getting Started

### 1. Install dependencies

npm install

### 2. Create .env file

REACT_APP_API_URL=http://localhost:3000

### 3. Run the app

npm start

## Backend

Rails API backend — https://github.com/Kazybek10/percata

---

Built by [Kazybek Nurlanbek](https://github.com/Kazybek10) · Amsterdam
