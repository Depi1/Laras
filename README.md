# Laras

Laras is a MERN fashion storefront for browsing products, managing a cart, placing orders, and handling products and order statuses in an admin dashboard.

## Features

- Responsive landing page, product catalog, product details, and category/gender filters
- Four local demo products appear when the product API has no records; database products take priority
- Customer registration and login with JWT-backed requests
- Cart, checkout details, order history, and order cancellation
- Admin dashboard, product management, and order status updates
- One Axios API module with a shared Bearer-token interceptor

## Technology

React, Vite, React Router, Axios, Node.js, Express, MongoDB, and Mongoose.

## Run locally

Use two terminals from the project root.

### Backend

```powershell
cd server
npm install
npm run dev
```

Create `server/.env` locally with values for `MONGO_URI`, `JWT_SECRET`, and `PORT=8000`. Never commit or upload this file.

### Frontend

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`. The API defaults to `http://localhost:8000`; set `VITE_API_URL` only if your backend uses another address.

## Project layout

- `client/src/pages/` contains storefront, account, and admin pages.
- `client/src/components/` contains navigation, auth state, route guards, and shared UI.
- `client/src/api.js` contains all HTTP calls.
- `client/src/demoData.js` contains the visual demo catalog fallback.
- `server/` contains the Express API and Mongoose models.

## Current scope

The checkout stores a payment-method choice but does not process a real payment. Reviews, inventory tracking, and confirmation emails are not implemented. The supplied backend does not yet expose banner or user-list endpoints, so the banner editor saves to the current browser only.
