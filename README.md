# Mini Ticket Tracker

A small ticket-tracking app with a React interface, an Express API, and a PostgreSQL database.

## Run locally

You need Node.js, npm, and PostgreSQL 15 or newer.

1. Set up PostgreSQL and create a database for the app.
2. In `server/`, install dependencies and configure the database:

   ```sh
   cd server
   npm install
   cp .env.example .env
   ```

   Set `DATABASE_URL` in `server/.env` to your PostgreSQL connection string, then initialize the tables:

   ```sh
   npx prisma db init
   ```

3. Start the API in the `server/` directory:

   ```sh
   npm run dev
   ```

4. In a second terminal, start the client:

   ```sh
   cd client
   npm install
   npm run dev
   ```

   Open the local URL printed by Vite. The client forwards `/tickets` requests to the API on port 3000.

See [client/README.md](client/README.md) and [server/README.md](server/README.md) for component-specific details and API tests.

## Decisions & Tradeoffs

Used Prisma ORM for database access and easy schema management.
I kept the interface to one page so tickets, filters, and ticket creation are easy to reach.
I added a get-one-ticket endpoint in addition to the requested endpoints, so a ticket can be opened for its full details.
I used UUIDs for ticket IDs instead of sequential numbers.
I added a database index on status and priority to help with common ticket lookups.
With more time, I would improve error handling around database failures and add more tests for filtering and pagination.
