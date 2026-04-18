# Slooze backend

NestJS + GraphQL API for the food-ordering.

## Run locally

```bash
npm install
```

Create a `.env` with your Postgres URL (same format you use for Prisma):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
```

Then sync the database and seed demo data:

```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

Start the server:

```bash
npm run start:dev
```

- GraphQL HTTP endpoint: `http://localhost:3000/graphql` (Nest default for Apollo)
- Health check (no auth): `GET http://localhost:3000/health` → `{ "status": "ok" }`
- Generated SDL (for reference): `src/schema.gql` after the app runs or builds

## Auth (required for every operation below)

There is no login mutation in this build. The guard reads **HTTP headers** on each request:

| Header | Example | Purpose |
|--------|---------|--------|
| `x-user-id` | `any-uuid-or-string` | User id |
| `x-user-role` | `ADMIN` / `MANAGER` / `MEMBER` | RBAC |
| `x-user-country` | `INDIA` or `AMERICA` | Country-scoped data |

For **testing** in GraphQL Playground, Apollo Sandbox, Insomnia, etc., set the user under **HTTP Headers** as JSON (exact keys the API expects):

```json
{
  "x-user-id": "test-member",
  "x-user-role": "MEMBER",
  "x-user-country": "INDIA"
}
```

Use `ADMIN` or `MANAGER` for `x-user-role` when you need mutations that members cannot call (e.g. checkout, cancel). Use `AMERICA` for `x-user-country` to hit US-scoped data.

Example (curl with the same values):

```bash
curl -s http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-member" \
  -H "x-user-role: MEMBER" \
  -H "x-user-country: INDIA" \
  --data '{"query":"{ restaurants { id name country menuItems { id name price } } }"}'
```

## Queries

### `restaurants`

Lists restaurants (and menu items) for the caller’s country.

```graphql
query {
  restaurants {
    id
    name
    country
    menuItems {
      id
      name
      price
      restaurantId
    }
  }
}
```

**Roles:** `ADMIN`, `MANAGER`, `MEMBER`

---

## Mutations

### `createOrder`

Creates an order from a restaurant and line items.

```graphql
mutation {
  createOrder(
    input: {
      restaurantId: "2ba22493-d186-4fab-a614-f9d31861fbc6"
      items: [{ menuItemId: "b71bb314-0502-4ea7-914c-9a9fde27575c", quantity: 2 }]
    }
  ) {
    id
    status
    userId
    createdAt
  }
}
```

**Roles:** `ADMIN`, `MANAGER`, `MEMBER`

---

### `checkoutOrder`

Marks an order as paid.

```graphql
mutation {
  checkoutOrder(orderId: "28cacef1-3ced-4cd3-94b1-b22e6ed826e4") {
    id
    status
  }
}
```

**Roles:** `ADMIN`, `MANAGER` only (not `MEMBER`).

**Testing:** If you have been using the sample headers with `"x-user-role": "MEMBER"`, change the user in your **HTTP Headers** payload to `MANAGER` or `ADMIN` before running this mutation, for example:

```json
{
  "x-user-id": "test-user-1",
  "x-user-role": "MANAGER",
  "x-user-country": "INDIA"
}
```

---

### `cancelOrder`

Cancels an order.

```graphql
mutation {
  cancelOrder(orderId: "<order-id>") {
    id
    status
  }
}
```

**Roles:** `ADMIN`, `MANAGER` only (same as `checkoutOrder`: use `MANAGER` or `ADMIN` in headers, not `MEMBER`).

---

### `addPaymentMethod`

Adds a saved payment method (minimal fields in this API).

```graphql
mutation {
  addPaymentMethod(type: "CARD", lastFour: "4242") {
    id
    type
  }
}
```

**Roles:** `ADMIN` only

---

For the exact field names and types, open `src/schema.gql` after the app has generated it, or introspect the running schema.
