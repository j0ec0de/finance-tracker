# Upcoming backend features

Planned work to make the API ready for the frontend. Items are in the order they should be built.

Status legend: **Done** — merged into the working tree and verified. **Next** — planned, not started. **Later** — planned, scheduled after the items above.

## Done

### 1. Per-user ownership for accounts, categories, and transactions
- The user id is taken from the verified token (`req.user`), never from the request body or query string.
- Every query is filtered by the caller's id. Another user's rows return 404.
- Transactions check that the account and category they reference belong to the caller, on create and on update.

### 2. Self-only user endpoints
- `GET /api/users` and `GET /api/users/:id` removed. No cross-user listing.
- `GET /api/users/me`, `PATCH /api/users/me`, `DELETE /api/users/me` added.
- `POST /api/users` removed; sign-up stays on `POST /api/auth/register`.
- Changing email to one already in use returns 409.

### 3. Stop direct balance edits on accounts
- `PATCH /api/accounts/:id` no longer accepts `balance`. Balance changes only through transactions.
- `balance` on `POST /api/accounts` stays as an opening balance (defaults to 0).

### 4. CORS
- `cors` middleware added in `src/index.ts`. Allowed origins come from `CORS_ORIGINS` (comma-separated), defaulting to `http://localhost:5173` (Vite dev server).

### 5. Paginated transaction list
- `GET /api/transactions` returns `{ data, total, limit, offset }`. `total` counts all rows matching the same filters, not just the page.
- Rows are ordered by `occurredAt` then `id`, so pages stay stable when several transactions share a date.

## Next

### 6. Summary endpoints
- `GET /api/transactions/summary?startDate&endDate` — income, expense, and net totals for the period.
- `GET /api/transactions/by-category?startDate&endDate` — totals per category for the period.

Net worth can be the sum of account balances on the client.

### 7. Clear errors for bad references
A foreign-key violation or invalid id currently surfaces as a 500. Map Postgres foreign-key errors to 400 or 404 with a clear message.

### 8. Tests for the balance logic
There is no test suite. Add tests for account balance changes on create, edit (including moving a transaction to another account or changing its amount or type), and delete, before refactoring further.

## Later

### 9. Money format
Postgres `numeric` values come back as strings, and so do amounts and balances. Confirm the convention (keep strings and format on the client) and document it in the API notes.

### 10. Transfers between accounts
An endpoint that creates a linked pair of transactions (expense on one account, income on the other) in one database transaction.

### 11. Default categories
Seed a starter set of categories on registration, or leave categories fully user-defined. Decide first (see open decisions).

### 12. Currency handling in totals
Accounts have a currency, but totals across currencies cannot be added. Either restrict summaries to one currency or group totals by currency.

### 13. Token refresh and logout
Tokens expire after 1 day with no refresh. Decide whether the frontend re-logs in, or add refresh tokens.

## Open decisions

- **Frontend dev setup:** CORS is in place (feature 4). A Vite proxy to `/api` is still an option if the frontend would rather avoid CORS in development.
- **Default categories:** seed on registration, or user-defined only?
- **Transfers:** in scope for the first frontend release?
- **Currency:** single currency for summaries, or grouped by currency?
- **Duplicate profile route:** keep both `GET /api/auth/me` and `GET /api/users/me`, or remove one?
