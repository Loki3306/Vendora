# Vendora Phase III — Module Map (MongoDB)

## Module 1 — MongoDB Data Layer
Files: `vendora-backend/src/models/*`, `src/config/database.js`, `src/services/id.service.js`, `database/mongodb-schema.md`, `scripts/seed.js`.

Mongoose defines the application collections and indexes. The internal `counters` collection supplies stable numeric public IDs. MongoDB is the main runtime database.

## Module 2 — Authentication and Authorization
JWT authentication, bcrypt hashing, customer/vendor/admin role middleware, and verified-vendor enforcement.

## Module 3 — Customer APIs
Product discovery, categories/vendors metadata, persistent cart, stock-safe ordering, order tracking, and notifications.

## Module 4 — Vendor APIs
Dashboard KPIs, product management, vendor-scoped orders, forward-only fulfillment status, and analytics.

## Module 5 — Admin APIs
Platform KPIs, user controls, vendor governance, category management, and sales reports.

## Module 6 — Frontend
React/Vite/Tailwind UI with Customer, Vendor, and Admin portals backed by the same REST API.

## Security Notes
- Passwords use bcrypt hashes.
- JWT protects authenticated routes.
- Role and ownership checks are enforced server-side.
- Mongoose query objects are constructed from validated values rather than client-provided database operators.
- Unique indexes protect email/cart/review invariants.
- Stock uses atomic conditional updates.
