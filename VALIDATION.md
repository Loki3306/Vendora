# Vendora MongoDB Build Validation

Validation targets for this package:

- Backend JavaScript syntax check for all generated `.js` files.
- No active `mysql2`, SQL query, or `schema.sql` dependency in the backend.
- MongoDB/Mongoose models exist for all nine primary application collections.
- Seed data preserves the original demo users, vendors, categories, products, orders, reviews, and notifications.
- Frontend API contract retains numeric public IDs.
- Integration tests use Mongo-backed models.

Runtime integration tests require a reachable MongoDB instance. Run `npm run seed` before `npm test`.
