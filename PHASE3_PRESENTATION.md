# Vendora Phase III Presentation Outline — MongoDB Edition

## 1. Problem and Goal
A secure multi-vendor marketplace with separate Customer, Vendor, and Admin experiences.

## 2. Architecture
React/Vite client → Axios/REST/JWT → Node.js/Express API → Mongoose → MongoDB.

## 3. MongoDB Design
Nine primary application collections plus an internal counter collection. Stable numeric public IDs preserve API compatibility while MongoDB `_id` remains internal.

## 4. Customer Portal
Catalog search/filters, cart, stock-safe checkout, order history, tracking, notifications.

## 5. Vendor Portal
Verified-vendor guard, catalog management, fulfillment workflow, low-stock KPIs, revenue and product/category analytics.

## 6. Admin Portal
User governance, vendor approvals, categories, marketplace KPIs, sales reports.

## 7. Security
bcrypt password hashing, JWT authentication, RBAC, ownership checks, validation, Helmet and CORS.

## 8. MongoDB Consistency Strategy
Atomic conditional inventory decrement prevents overselling a single product. Compensating rollback restores already-decremented products if a later checkout step fails, keeping local standalone MongoDB setup simple.

## 9. Demo
Seed database → login as Customer/Vendor/Admin → demonstrate end-to-end flows.
