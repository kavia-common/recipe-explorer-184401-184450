# Recipe Explorer Frontend (Qwik)

Modern Qwik app for browsing, searching, adding, editing, and viewing recipes. Styled with the Ocean Professional theme (blue primary and amber accents), responsive and accessible.

## Features
- Routing: `/` (list/search), `/recipe/:id` (details), `/recipe/new`, `/recipe/:id/edit`
- Components: Navbar, Button, Card, Modal, and a RecipeForm
- Search and filters (cuisine, type) with basic pagination
- Data service uses `VITE_API_BASE` for REST (`GET /recipes`, `GET /recipes/:id`, `POST /recipes`, `PUT /recipes/:id`)
- If `VITE_API_BASE` is empty, uses an in-memory mock service with the same interface
- Loading, error, and empty states
- Ocean Professional theme via CSS variables

## Getting started

1) Install deps:
```bash
npm install
```

2) Configure environment:
- Copy `.env.example` to `.env` and set values as needed.
- If you have a backend, set `VITE_API_BASE` to its base URL.
- If `VITE_API_BASE` is empty, the app will use local mock data automatically (especially in development).

3) Run in dev (SSR):
```bash
npm start
```
App runs at http://localhost:3000

4) Preview production:
```bash
npm run preview
```

5) Build:
```bash
npm run build
```

## Environment variables
- `VITE_API_BASE`: Base URL for backend API (e.g., http://localhost:8080). If empty, mock is used.
- `VITE_BACKEND_URL`: Alternative key that may be used by your environment. If set, used as a fallback to `VITE_API_BASE`.
- `VITE_NODE_ENV`: When `development` and `VITE_API_BASE` is empty, mock is used.

See `.env.example` for additional keys accepted by the environment.

## Project Structure
```
src/
  components/
    recipes/RecipeForm.tsx
    ui/{Navbar,Button,Card,Modal}.tsx
  routes/
    index.tsx                 # Home list/search
    recipe/[id]/index.tsx     # Details
    recipe/new/index.tsx      # Add
    recipe/[id]/edit/index.tsx# Edit
  services/
    {api,types,mockData}.ts
```

## Styling
- Theme tokens are defined in `src/global.css` under `:root` using CSS variables.
- Components/pages use a clean, rounded, and shadowed aesthetic with subtle gradients.

## Notes
- No endpoints are hardcoded; base URL comes from `import.meta.env`.
- The mock layer simulates latency and supports search/filter/pagination logic.
