# Library Frontend

A React + TypeScript single-page app for a library system with role-based workflows.

## Project Snapshot
- Domain: book catalog, reservations queue, and active loans.
- Auth: JWT-based login/register.
- Roles: `USER`, `LIBRARIAN`, `ADMIN` (decoded from JWT roles claim).
- UI scope:
  - `USER`: browse books, reserve/queue books, track loans/reservations.
  - `LIBRARIAN`: manage all loans/reservations, create loans from reservations, process expired reservations.
  - `ADMIN`: librarian capabilities + manage books and users.

## Tech Stack
- React 19
- TypeScript (strict mode)
- Vite 7
- React Router 7
- TanStack Query 5
- Axios
- Tailwind CSS 4

## Architecture
- `src/api/*`: typed API clients for auth, books, loans, reservations, users.
- `src/hooks/*`: feature hooks wrapping query/mutation logic and UI state.
- `src/components/*`: reusable UI split by domain (`Home`, `Dashboard/books|users|loans|reservations`).
- `src/providers/AuthProvider.tsx`: auth context, token persistence, role derivation.
- `src/Router.tsx`: route mapping + protected dashboard route.

## Routing and Access
- `/`: public home page with catalog and reserve/queue actions.
- `/login`, `/register`: authentication flows.
- `/dashboard`: protected route (requires token); rendered content varies by role.

## API Integration
- Frontend calls `/api/v1/*`.
- Dev proxy in `vite.config.ts` forwards `/api` to `http://localhost:8080`.
- Token is stored in `localStorage` under `authToken` and attached as `Authorization: Bearer <token>`.

## Data and State Strategy
- TanStack Query is used for server state and cache invalidation.
- Shared query keys are centralized in `src/api/queryKeys.ts`.
- Several dashboard mutations use optimistic updates (with rollback on error).
- Query defaults in `src/main.tsx`:
  - `retry: 1`
  - `staleTime: 30_000`
  - `refetchOnWindowFocus: false`

## Local Run
Prerequisites: Node.js LTS and `pnpm`.

```bash
pnpm install
pnpm dev
```
