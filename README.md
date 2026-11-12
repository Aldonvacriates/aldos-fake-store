# Aldo's Fake Store

A responsive React storefront demo built on the public [Fake Store API](https://fakestoreapi.com/): browse and search products, add and edit them with forms or delete them, keep a cart that survives page reloads, and walk through a mock checkout.

**Live demo:** https://aldos-fake-store.vercel.app

Built as a React assignment during the Coding Temple bootcamp, August 2025.

> **Note on data:** the Fake Store API accepts `POST`, `PUT` and `DELETE` requests and returns a success response, but it does not save anything. The catalog does not change afterwards: new products do not appear, edits are lost and deleted products are still listed. Checkout is also simulated: no payment is processed and no order is sent anywhere.

## Features

- **Product catalog** with a text search (title and description) and a category filter, both applied client side (`src/pages/ProductList.jsx`).
- **Product details** page with Add to Cart and Edit buttons, and Delete behind a confirmation modal (`src/pages/ProductDetails.jsx`).
- **Add and edit product forms** that send `POST` / `PUT` requests to the API (`src/components/AddProduct.jsx`, `src/components/EditProduct.jsx`).
- **Cart** with quantity updates, item removal, clear cart, a live item count in the navbar and a running total, persisted to `localStorage` (`src/context/CartContext.jsx`, `src/pages/CartPage.jsx`).
- **Mock checkout** with contact, shipping and payment fields, client-side validation (required fields, email, card number length, MM/YY expiry, CVC), a short simulated delay and a generated order ID; the cart is cleared on success (`src/components/Checkout.jsx`).
- Toast notifications, loading spinners and error states (the product list adds a Retry button).

## Tech stack

React 19, Vite 7, React Router 7, React Bootstrap 2 / Bootstrap 5, Axios, React Toastify, ESLint 9. Plain JavaScript (JSX). Deployed on Vercel.

## How it works

- **Cart state is a reducer behind React Context.** `CartProvider` in `src/context/CartContext.jsx` uses `useReducer` with `ADD`, `REMOVE`, `UPDATE_QTY` and `CLEAR` actions. The initial state is loaded lazily from `localStorage` (key `cart:v1`) and written back on every change, with reads and writes wrapped in `try/catch`: malformed or unavailable storage on load falls back to an empty cart, and a failed write is ignored instead of crashing the app. Only a small snapshot of each product (id, title, price, image) is stored. `cartCount` and `cartTotal` are derived with `useMemo`.
- **A guarded `useCart` hook.** `src/hooks/useCart.js` wraps `useContext` and throws a clear error if a component is rendered outside `CartProvider`.
- **Cancellable fetches.** `ProductList.jsx` loads products and categories in parallel with `Promise.all` and passes an `AbortController` signal to Axios. The effect cleanup aborts in-flight requests, and a cancelled request does not show an error. `ProductDetails.jsx` cancels its single request the same way.
- **Routing.** `src/App.jsx` defines all routes (`/`, `/products`, `/products/:id`, `/addproduct`, `/edit-product/:id`, `/cart`, `/checkout`) and redirects unknown paths to the home page.

## Getting started

Prerequisites: Node.js 20.19+ or 22.12+ (required by Vite 7) and npm.

```bash
git clone https://github.com/Aldonvacriates/aldos-fake-store.git
cd aldos-fake-store
npm install
npm run dev        # http://localhost:5173
```

No environment variables are needed; the API base URL (`https://fakestoreapi.com`) is set in the source.

| Command           | What it does                     |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start the Vite dev server        |
| `npm run build`   | Build for production into `dist` |
| `npm run preview` | Serve the production build       |
| `npm run lint`    | Run ESLint                       |

There is no automated test suite yet.

## Project structure

```
src/
  api/api.js          Axios helpers for the product endpoints
  components/         Navbar, add/edit product forms, checkout, loader
  context/            CartContext (reducer + localStorage persistence)
  hooks/              useCart, plus useApi, useDebounce, useLocalStorage
  pages/              Home, ProductList, ProductDetails, CartPage
  App.jsx             Routes, CartProvider and toast container
```

## What I'd improve next

- Route every request through `src/api/api.js` (only the edit page uses it today; the list, details and add pages call Axios directly with hardcoded URLs) and read the base URL from a Vite env variable.
- Use the hooks that are already written but not wired in yet: `useDebounce` for the search box and `useApi` for fetching.
- Add tests for the cart reducer and the checkout validation.

## Credits

Product data from the [Fake Store API](https://fakestoreapi.com/). Author: [Aldo Herrera](https://github.com/Aldonvacriates).
