# Library Frontend

A React + TypeScript + Tailwind CSS front-end for a library system. It combines a public book catalog with authenticated borrowing and an admin dashboard for managing loans, users, and books.

Backend repo: [library-backend](https://github.com/mikolajm190/library-backend)

## Notice
- The majority of the code lives on the `genai/main` branch and is vide coded.

## At a glance
- Public catalog with availability indicators and quick borrow actions.
- Auth flow (register/login), JWT storage, and protected routes.
- Personal loan dashboard with cancel/extend actions.
- Admin-only panels to manage users and books with pagination.
- React Query caching, optimistic updates, and API error handling.
- Tailwind v4 styling with custom typography and design tokens.

## Tech stack
- React 19 + TypeScript
- Tailwind CSS 4
- Vite 7
- React Router 7
- TanStack React Query 5
- Axios
- Lucide Icons

## How it works
### Routes
- `/` Public catalog (home).
- `/login` and `/register` Auth pages.
- `/dashboard` Protected route for loans and admin panels.
- `*` Not found.

### Authentication and roles
- JWT is stored under `authToken` in localStorage.
- Role is derived from the token payload `roles[]` (`ROLE_ADMIN` or `ROLE_USER`).
- Admin panels render only for `ROLE_ADMIN`.
- The auth state syncs across tabs via the `storage` event.

### API integration
- Base URL: `/api`
- Dev proxy: `http://localhost:8080` (see `vite.config.ts`)
- Authorization: `Authorization: Bearer <token>` is attached in `src/api/client.ts`.

Endpoints used by this frontend:
- `POST /v1/auth/login`
- `POST /v1/auth/register`
- `GET /v1/books`
- `POST /v1/loans`
- `PUT /v1/loans/:id` (prolong)
- `DELETE /v1/loans/:id`
- `GET /v1/users`
- `GET /v1/users/me`
- `POST /v1/users`
- `PUT /v1/users/:id`
- `DELETE /v1/users/:id`

### Data model
- Book: `id`, `title`, `author`, `availableCopies`, `copiesOnLoan`
- Loan: `id`, `borrowDate`, `returnDate`, `user`, `book`
- User: `id`, `username`

## Local development
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start the backend API on `http://localhost:8080` (or update the proxy in `vite.config.ts`).
3. Run the dev server:
   ```bash
   pnpm dev
   ```

## Architecture and code tour
- `src/main.tsx` App bootstrap, React Query config, and providers.
- `src/Router.tsx` Route definitions and protected routing.
- `src/providers/AuthProvider.tsx` Auth state, cross-tab sync, and role detection.
- `src/api/` API client, endpoints, and error helpers.
- `src/hooks/` Data hooks and mutations (React Query).
- `src/pages/` Page-level layout and orchestration.
- `src/components/` Reusable UI modules and dashboard panels.
- `src/hooks/useBorrowBook.ts` Borrow flow, auth redirect, and cache invalidation.
- `src/hooks/useLoansPanel.ts` Optimistic updates for loan actions.
- `src/hooks/useBooksAdmin.ts` and `src/hooks/useUsersAdmin.ts` CRUD with pagination.
- `src/api/client.ts` Token handling and request headers.
- `src/index.css` Typography and design tokens used by Tailwind classes.

## UI and design notes
- Typography and color tokens live in `src/index.css` using CSS variables.
- Tailwind utility classes build a responsive layout with cards and dashboard panels.
- Icons come from Lucide to keep the visual style consistent.

## Testing
No automated tests are included in this repository yet.

## Future improvements (optional)
- Add unit tests for hooks and API logic.
- Add E2E coverage for auth and borrowing flows.
- Change admin panels to a tabbed layout.
- Containerize the client.
