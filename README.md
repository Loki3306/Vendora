# Vendora — MongoDB Edition
### Secure Multi-Vendor E-Commerce Marketplace | Phase III

Vendora is a full-stack marketplace with separate Customer, Vendor, and Admin portals. This build uses **MongoDB as the primary database** through **Mongoose**; the previous MySQL runtime dependency has been removed.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Charts | Recharts |
| HTTP | Axios |
| Backend | Node.js 20+ + Express |
| Database | MongoDB 7+ / MongoDB Atlas |
| ODM | Mongoose 8 |
| Authentication | JWT + bcrypt |
| Security | Helmet, CORS, express-validator |
| Testing | Jest + Supertest |

## MongoDB Data Model

Vendora keeps nine primary application collections: `users`, `vendors`, `categories`, `products`, `orders`, `order_items`, `cart`, `reviews`, and `notifications`. An internal `counters` collection generates atomic numeric public IDs such as `product_id` and `order_id`, allowing the existing frontend/API contract to stay unchanged while MongoDB `_id` remains internal.

Indexes enforce unique emails, public IDs, cart uniqueness, review uniqueness, and common vendor/category/order lookup paths. Application-level reference checks protect relationships that were previously enforced by SQL foreign keys.

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Community Server running locally **or** a MongoDB Atlas connection string

Default local connection:

```text
mongodb://127.0.0.1:27017/vendora_db
```

## Windows PowerShell — First Run

From the extracted `vendora` folder:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\setup.ps1
npm run seed
npm run dev
```

Then open:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
Health:   http://localhost:5000/health
```

If you use MongoDB Atlas, edit `vendora-backend/.env` and replace `MONGODB_URI` with your Atlas URI before running the seed command.

## Manual Setup

```bash
npm install
npm --prefix vendora-backend install
npm --prefix vendora-frontend install
```

Create the backend environment file:

```powershell
Copy-Item .\vendora-backend\.env.example .\vendora-backend\.env
```

Seed MongoDB:

```bash
npm run seed
```

Start frontend and backend together:

```bash
npm run dev
```

## Environment

`vendora-backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/vendora_db
MONGODB_SERVER_SELECTION_TIMEOUT_MS=5000
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Customer | `rahul.m@gmail.com` | `password123` |
| Customer | `priya.s@gmail.com` | `password123` |
| Vendor | `arjun.k@gmail.com` | `password123` |
| Vendor | `pooja.i@gmail.com` | `password123` |
| Vendor | `ravi.j@gmail.com` | `password123` |
| Pending Vendor | `glowbeauty@vendora.com` | `password123` |
| Vendor | `fitlife@vendora.com` | `password123` |
| Vendor | `homeessentials@vendora.com` | `password123` |
| Admin | `admin@vendora.com` | `admin123` |

## Seed Data

A fresh `npm run seed` resets the Vendora MongoDB collections and creates:

- 9 users
- 6 vendors
- 8 categories
- 24 products
- 3 sample Rahul orders
- 5 order items
- 2 reviews
- 1 welcome notification
- numeric ID counters initialized for future records

## Core Features

**Customer:** JWT login/registration, product filters/search, persistent cart, stock-safe checkout, order tracking, notifications.

**Vendor:** verification guard, product CRUD/archive, order fulfillment, low-stock dashboard, revenue metrics, product/category analytics.

**Admin:** dashboard KPIs, user suspension/deletion safeguards, vendor approval/suspension, category CRUD, sales reporting.

## Checkout Consistency in MongoDB

Stock is decremented with atomic conditional updates that only succeed when enough stock exists. If a later checkout step fails, Vendora performs compensating stock rollback and removes any partially created order records. This design runs on a normal standalone local MongoDB server; it does not force you to configure a replica set just to develop the project.

## Tests

Seed first, then run:

```bash
npm run seed
npm test
```

The integration tests cover authentication, product browsing, cart operations, stock decrement, order retrieval, vendor order progression, and notification creation.

## Project Structure

```text
vendora/
├── vendora-backend/
│   ├── database/mongodb-schema.md
│   ├── scripts/seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/{customer,vendor,admin}/
│   │   ├── middleware/
│   │   ├── routes/{customer,vendor,admin}/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── vendora-frontend/
├── MONGO_MIGRATION.md
├── MODULES.md
├── PHASE3_PRESENTATION.md
├── setup.ps1
└── package.json
```

## Resetting the Database

Running the seed command is a destructive demo reset for the Vendora database configured in `MONGODB_URI`:

```bash
npm run seed
```

Do not point `MONGODB_URI` at a production database when running the demo seed script.
