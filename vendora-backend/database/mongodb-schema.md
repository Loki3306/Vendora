# Vendora MongoDB Schema

Vendora uses MongoDB through Mongoose. The application keeps stable numeric public IDs (`user_id`, `vendor_id`, `product_id`, etc.) so the REST API and frontend remain compatible, while MongoDB `_id` values stay internal.

Primary collections: `users`, `vendors`, `categories`, `products`, `orders`, `order_items`, `cart`, `reviews`, and `notifications`. The internal `counters` collection provides atomic numeric ID sequences.

Important indexes include unique user emails, unique public IDs, `(user_id, product_id)` uniqueness for cart rows and reviews, product vendor/category indexes, order user/status indexes, and order-item vendor/order indexes.

Application-level reference checks replace SQL foreign keys. Order history is protected by admin deletion guards. Stock changes use atomic conditional updates (`stock_qty >= requested quantity`) with compensating rollback if a multi-document checkout step fails.
