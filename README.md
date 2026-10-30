# Laras — Fashion for Every Day

Laras is a small fashion store built as my MERN capstone project. I wanted the shopping flow to feel simple: browse a few collections, check product details, add something to the cart, and place an order. There is also an admin area for managing the catalog and keeping an eye on orders.

## What you can do

- Browse products, search the catalog, and filter by category or gender
- View product details, choose a size, and add items to the cart
- Create a customer or admin account and sign in
- Place a COD order and check its status from the profile page
- Add or edit products, update order statuses, and view store counts as an admin

If the API is unavailable, Laras can switch to a clearly marked demo mode. Demo data stays in that browser and is not saved to MongoDB.

## Built with

React, Vite, React Router, and Axios on the frontend; Node.js, Express, Mongoose, and MongoDB on the backend.

## Run it on your computer

You will need Node.js and a MongoDB database. Open two PowerShell terminals from the project folder.

### 1. Start the API

```powershell
cd server
npm install
npm run dev
```

Before starting it, configure `MONGO_URI`, `JWT_SECRET`, and `PORT=8000` in your private server environment. Keep those values out of GitHub and screenshots.

### 2. Start the website

```powershell
cd client
npm install
npm run dev
```

Open the local address printed by Vite, usually `http://localhost:5173`. The frontend looks for the API at `http://localhost:8000` by default.

## Where things live

- `client/src/pages/` contains the store, account, and admin screens.
- `client/src/components/` contains shared layout and authentication pieces.
- `client/src/api.js` keeps the frontend's API requests in one place.
- `client/src/demoStore.js` holds the browser-only demo data and actions.
- `server/index.js` contains the Express API routes.
- `server/models/Schema.js` defines the MongoDB models.

## A note about checkout

Checkout saves the delivery details, order items, and chosen payment method. COD orders can be placed and viewed in the order history, but Laras does not process online payments or connect to a payment gateway yet. Banner editing is browser-local, and the supplied API does not include a user-list endpoint. Before a real launch, admin account creation and order-cancellation permissions should also be tightened on the server.
