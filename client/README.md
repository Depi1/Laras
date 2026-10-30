# Laras — Fashion for Every Day

Laras is a MERN fashion storefront for browsing products, viewing product details, managing a cart, placing COD orders, and handling products and order statuses in an admin dashboard.

## Features

- Responsive landing page, catalog, product details, search, category/gender filters, and sorting
- Customer and admin registration/login with JWT-backed requests
- Cart, delivery form, COD order placement, order history, and cancellation
- Admin dashboard statistics, product create/edit/delete, and order status updates
- Centralized Axios API module with Bearer-token handling
- Clearly labelled browser-local demo fallback when the API cannot be reached

## Technology

React, Vite, React Router, Axios, Node.js, Express, MongoDB, and Mongoose.

## Run locally

Start each side in a separate PowerShell terminal from the repository root.

### Backend

```powershell
cd server
npm install
npm run dev
```

Configure `MONGO_URI`, `JWT_SECRET`, and `PORT=8000` in your private server environment. Keep environment values out of Git and screenshots.

### Frontend

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL printed in the terminal, normally `http://localhost:5173`. The client API defaults to `http://localhost:8000`.

## Project layout

- `client/src/pages/` storefront, account, and admin screens
- `client/src/components/` shared layout, auth context, and route guard
- `client/src/api.js` API methods and browser-demo fallback routing
- `client/src/demoStore.js` browser-local demo accounts, catalog, cart, and orders
- `server/index.js` Express endpoints
- `server/models/Schema.js` Mongoose schemas

## Demo limits

Checkout records the COD/payment-method choice and creates an order; it does not process a real payment. Browser fallback data stays in the current browser. The supplied server does not implement persistent banner or user-list endpoints. Admin role creation and order-cancellation ownership checks need server-side hardening before deployment.
