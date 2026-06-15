# Wow Burger Fullstack App

A full-stack restaurant menu and admin dashboard application with:
- **Backend:** NestJS + Passport JWT + TypeORM
- **Frontend:** React + Vite + Tailwind CSS

## What this repo contains

- `backend/` — NestJS API server with authentication and menu management
- `frontend/` — Vite-powered React app for customer browsing and admin portal

## Build status

Both apps have been built successfully in this workspace:
- `frontend/dist/` — production-ready frontend bundle
- `backend/dist/` — compiled NestJS server output

## Prerequisites

- Node.js 20+ recommended
- npm 10+ or compatible package manager

## Backend build

```bash
cd backend
npm install
npm run build
```

### Backend development

```bash
cd backend
npm run start:dev
```

### Backend production

```bash
cd backend
npm run start:prod
```

## Frontend build

```bash
cd frontend
npm install
npm run build
```

### Frontend development

```bash
cd frontend
npm run dev
```

### Frontend preview

```bash
cd frontend
npm run preview
```

## Admin panel access

The frontend includes an admin portal that is opened by clicking the shield icon in the header.

## Notes

- If you need type declarations for React in the frontend, install `@types/react` and `@types/react-dom`.
- The backend uses JWT authentication and requires `JWT_SECRET` configured in environment variables for production.

## Useful paths

- `frontend/src/` — React source files
- `backend/src/` — NestJS source files
- `frontend/dist/` — generated frontend build
- `backend/dist/` — generated backend build

## License

This project is currently private / unlicensed.
