# BuyKart Completion Tasks

## P0: Make checkout trustworthy

- [x] Add a runnable API service with health, products, auth, cart, and order endpoints.
- [x] Persist users, products, carts, and orders in MongoDB using environment configuration.
- [ ] Move login and registration from local-only state to API-backed sessions.
- [ ] Replace client-created orders with `POST /api/orders` and server-calculated totals.
- [ ] Add a real payment provider in test mode, with webhook verification before marking an order paid.
- [ ] Reserve and decrement inventory transactionally during checkout.
- [ ] Add route guards for account, orders, and checkout pages.

## P1: Connect the storefront to the backend

- [ ] Load products, categories, search, and filters from the API with pagination.
- [ ] Sync cart and wishlist per authenticated user; keep local storage as a temporary offline cache only.
- [ ] Persist addresses and payment preferences through user-owned endpoints.
- [ ] Add loading, empty, unauthorized, and API-error states to every data-backed page.
- [ ] Add order detail, cancellation, return, and status-history flows.

## P1: Fix storefront behavior

- [x] Make “Save for later” idempotently add to wishlist before removing from cart.
- [ ] Enforce `inStock` and quantity limits in product cards, product detail, and cart controls.
- [ ] Validate and migrate persisted local state so malformed storage cannot crash the app.
- [ ] Fix home “View All” links to filter by product badges instead of text search.
- [ ] Replace placeholder account sections with functional saved addresses, payments, and notification preferences.
- [ ] Make footer, terms, privacy, and support links route to real pages.

## P2: Quality and operations

- [ ] Add a database migration and seed command for products, users, orders, and inventory.
- [ ] Add API validation, structured logging, rate limiting, and secure cookie/token handling.
- [ ] Add unit tests for reducers, price calculations, auth, inventory, and order ownership.
- [ ] Add API integration tests and an end-to-end checkout test.
- [ ] Add CI for typecheck, build, tests, and formatting.
- [ ] Add local image/font fallbacks so the core UI works without external network access.

## Local commands

```text
npm install
npm run dev       # frontend on http://localhost:8443
npm run server    # API on http://localhost:8787
npm run build
```

The API uses MongoDB for persistence. Copy `.env.example` to `.env`, add your MongoDB connection string, then run `npm run server`.
