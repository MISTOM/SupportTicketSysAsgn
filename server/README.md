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

## Tests

Set `TEST_DATABASE_URL` in `.env` to a separate PostgreSQL test database with the app tables. Then run:

```sh
npm test
```

The API integration tests create temporary tickets and delete them when the tests finish. They require `TEST_DATABASE_URL` so they cannot accidentally write to the regular `DATABASE_URL` database.

To create the tables in the test database, run the schema setup with `DATABASE_URL` set to the test database connection string:

```sh
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/support_ticket_test" npx prisma db init
```

## Endpoints

- `POST /tickets` — create a ticket. A title is required; description is optional. Status defaults to `open` and priority to `low`.
- `GET /tickets?status=&page=&limit=` — list tickets, optionally filtered by status and paginated.
- `GET /tickets/:id` — get one ticket by its UUID.
- `PATCH /tickets/:id` — update a ticket's status, priority, or both.
- `GET /tickets/stats` — get ticket counts grouped by status, for example `{"open":2,"in_progress":1,"closed":0}`.

Valid statuses are `open`, `in_progress`, and `closed`. Valid priorities are `low`, `medium`, and `high`. The list endpoint defaults to page 1 with 10 tickets per page and limits page size to 100.

The database schema is in `src/prisma/contract.prisma`. It has a combined index on status and priority to support ticket lookups.
