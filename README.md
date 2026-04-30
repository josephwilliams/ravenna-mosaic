# The Small Council

Kanban board built for the Ravenna Coding Challenge.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- PostgreSQL via Neon (serverless)
- Prisma v6 ORM
- @hello-pangea/dnd for drag and drop
- Vitest for API tests

## Setup

```bash
pnpm install
```

Create `.env.local` with your Neon (or any Postgres) connection strings:

```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

If you're using Neon, `DATABASE_URL` should be the pooled connection string and `DIRECT_URL` the direct (non-pooled) one. Prisma uses `DIRECT_URL` for migrations.

## Database

Run migrations to create tables:

```bash
pnpm db:migrate
```

Optionally seed the database with sample data (a board with columns, cards, tags, and comments):

```bash
pnpm db:seed
```

Browse the database directly:

```bash
pnpm db:studio
```

## Dev

```bash
pnpm dev
```

## Tests

47 API tests covering boards, columns, cards, tags, and comments.

```bash
pnpm test
```

Tests hit a real database (no mocks). Make sure `.env.local` is configured.

## Key decisions

- **Neon Postgres** - needed connection pooling for serverless deploy on Vercel. Prisma CLI doesn't read `.env.local`, so `dotenv-cli` bridges that gap.
- **Optimistic UI** - drag/drop and reordering update state instantly, persist to the API in the background.
- **Uniform API responses** - every endpoint returns `{ data }` on success and `{ error: { code, message } }` on failure. Error codes are an enum (NOT_FOUND, VALIDATION, CONFLICT, INTERNAL).
- **Soft delete** - cards are archived, not destroyed. Hard delete on comments.
- **Next.js middleware for logging** - structured JSON logs on all `/api/*` routes.
- **Direct route handler tests** - tests call Next.js route handlers directly (no HTTP server). Faster, same code path as production.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm test` | Run API tests |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed with sample data |
| `pnpm db:studio` | Open Prisma Studio |

## TODO

- Rate limiting on API routes (e.g. Vercel Edge middleware or upstash/ratelimit)
- Input sanitization beyond Prisma's parameterized queries (additional defense-in-depth against injection)
- Authentication and authorization
