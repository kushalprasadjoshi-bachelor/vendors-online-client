# VendorsOnline Client

React/Vite frontend for VendorsOnline, a MERN e-commerce marketplace with vendor storefronts, customer carts, simulated escrow payments, OTP delivery confirmation, and admin dispute handling.

[Project Backend](https://github.com/kushalprasadjoshi-bachelor/vendors-online-server)

[Project Documenation](https://github.com/kushalprasadjoshi-bachelor/vendors-online)

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/kushalprasadjoshi-bachelor/vendors-online-client.git
cd vendors-online-client
```

Install dependencies:

```bash
npm install
```

---

## 🔐 Environment Variables

This project requires environment variables to run properly.

Create a `.env` file in the root directory:

```bash
touch .env
```

Then add the following variables:

```env
VITE_APP_NAME=VendorsOnline
VITE_API_BASE_URL=http://localhost:8000/
VITE_ENABLE_MOCKS=true
VITE_ESCROW_SIMULATION=true
```

Set `VITE_ENABLE_MOCKS=false` when the Express.js backend is ready.

### 📌 Variables Explained

- `VITE_APP_NAME`: The display name for the frontend application. It is used by the app to label the UI and can be customized for branding.
- `VITE_API_BASE_URL`: The base URL for the backend API. All client requests are sent to this endpoint, so set it to your Express.js server address.
- `VITE_ENABLE_MOCKS`: When `true`, the app uses mock data in `src/data` instead of calling the real backend. Set to `false` once your backend is available.
- `VITE_ESCROW_SIMULATION`: When `true`, escrow payments and delivery confirmation flows are simulated for development. Set to `false` when using a real escrow/payment integration.

---

## Run

```bash
npm run dev
```

Use `npm.cmd run dev` on Windows PowerShell if script execution blocks `npm.ps1`.

---

## Main Routes

- `/` customer homepage
- `/stores` vendor store listing
- `/stores/:storeSlug` store product listing
- `/stores/:storeSlug/products/:productSlug` product detail and reviews
- `/cart`, `/checkout`, `/orders` cart, escrow checkout, and OTP delivery confirmation
- `/login`, `/register` customer/vendor/admin access screens
- `/vendor` shop panel with product, order, and storefront management
- `/admin` admin panel with users, escrow transactions, and dispute queues

---

## Frontend Structure

- `src/config` app env, route, and navigation config
- `src/dtos` request/response DTO factories for users, auth, stores, products, carts, orders, escrow, reviews, and disputes
- `src/services` API client plus catalog/auth/order service adapters
- `src/plugins` app providers for auth and cart state
- `src/utils` formatting, storage, slug, rating, and role helpers
- `src/data` mock MERN-shaped data used while backend APIs are not connected

---

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

---

_Happy Coding!_