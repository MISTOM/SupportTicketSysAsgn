# Server

The API uses Express and Prisma ORM with PostgreSQL 15 or newer.

## Setup and run

From this directory:

```sh
npm install
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to a connection string for your PostgreSQL database, then create the database tables:

```sh
npx prisma db init
```

Start the API:

```sh
npm run dev
```

The API listens on `http://localhost:3000`.

## Endpoints

- `POST /tickets` — create a ticket. A title is required; description is optional. Status defaults to `open` and priority to `low`.
- `GET /tickets?status=&page=&limit=` — list tickets, optionally filtered by status and paginated.
- `GET /tickets/:id` — get one ticket by its UUID.
- `PATCH /tickets/:id` — update a ticket's status, priority, or both.
- `GET /tickets/stats` — get ticket counts grouped by status, for 

Valid statuses are `open`, `in_progress`, and `closed`. Valid priorities are `low`, `medium`, and `high`. The list endpoint defaults to page 1 with 10 tickets per page and limits page size to 100.

The database schema is in `src/prisma/contract.prisma`. It has a combined index on status and priority to support ticket lookups.
