# VendorsOnline Client

React/Vite frontend for VendorsOnline, a MERN e-commerce marketplace with vendor storefronts, customer carts, simulated escrow payments, OTP delivery confirmation, and admin dispute handling.

## Run

```bash
npm install
npm run dev
```

Use `npm.cmd run dev` on Windows PowerShell if script execution blocks `npm.ps1`.

## Environment

Copy `.env` when you need a local override.

```env
VITE_APP_NAME=VendorsOnline
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_ENABLE_MOCKS=true
VITE_ESCROW_SIMULATION=true
```

Set `VITE_ENABLE_MOCKS=false` when the Express.js backend is ready.

## Main Routes

- `/` customer homepage
- `/stores` vendor store listing
- `/stores/:storeSlug` store product listing
- `/stores/:storeSlug/products/:productSlug` product detail and reviews
- `/cart`, `/checkout`, `/orders` cart, escrow checkout, and OTP delivery confirmation
- `/login`, `/register` customer/vendor/admin access screens
- `/vendor` shop panel with product, order, and storefront management
- `/admin` admin panel with users, escrow transactions, and dispute queues

## Frontend Structure

- `src/config` app env, route, and navigation config
- `src/dtos` request/response DTO factories for users, auth, stores, products, carts, orders, escrow, reviews, and disputes
- `src/services` API client plus catalog/auth/order service adapters
- `src/plugins` app providers for auth and cart state
- `src/utils` formatting, storage, slug, rating, and role helpers
- `src/data` mock MERN-shaped data used while backend APIs are not connected

## Backend Contract Notes

The client expects an Express.js API under `VITE_API_BASE_URL` with JWT auth and role-based access control for `customer`, `vendor`, and `admin`.

Suggested API groups:

- `POST /auth/login`, `POST /auth/register`
- `GET /stores`, `GET /stores/:slug`, `GET /stores/:slug/products`
- `GET /products/:slug`, `GET /products/:id/reviews`
- `GET /orders`, `POST /orders`, `POST /orders/:id/confirm-delivery`
- `GET /escrow`
- `GET /disputes`

MongoDB collections should align with the DTOs in `src/dtos`.

