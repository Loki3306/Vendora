# Vendora MySQL → MongoDB Migration Notes

The runtime persistence layer has been fully replaced with MongoDB/Mongoose.

## Mapping

| Previous table | MongoDB collection | Public key retained |
|---|---|---|
| users | users | user_id |
| vendors | vendors | vendor_id |
| categories | categories | category_id |
| products | products | product_id |
| orders | orders | order_id |
| order_items | order_items | item_id |
| cart | cart | cart_id |
| reviews | reviews | review_id |
| notifications | notifications | notification_id |

The old `database/schema.sql` file was removed. Mongoose schemas in `vendora-backend/src/models/` are now the source of truth.

MongoDB `_id` is intentionally not used in public routes. This keeps frontend URLs, seed IDs, tests, Postman requests, and demo flows compatible with the earlier build.
