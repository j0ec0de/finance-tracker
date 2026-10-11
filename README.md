# Finch

A personal finance tracker.

- `backend/` — Express 5 + TypeScript API over Postgres (Drizzle ORM)
- `frontend/` — React 19 + TypeScript SPA (Vite, Tailwind CSS v4, shadcn/ui)

## Running locally

**Backend** (`backend/`):
```
npm install
npm run dev
```
Requires a `.env` file (see `backend/.env.example`) and a running Postgres instance.

**Frontend** (`frontend/`):
```
npm install
npm run dev
```
Requires a `.env` file (see `frontend/.env.example`) pointing `VITE_API_URL` at the backend.

## Deployment

- Backend: [Railway](https://railway.app) (Express + Postgres)
- Frontend: [Vercel](https://vercel.com)

See `CLAUDE.md` for architecture details.
