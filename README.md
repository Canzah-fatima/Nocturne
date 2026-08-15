# NOCTURNE — E-Commerce Storefront

An ultra-minimalist tech/luxury e-commerce app built with Next.js (App
Router), Tailwind CSS, Framer Motion, Lucide icons, and Zustand — matching
the obsidian/parchment/neon-cyan aesthetic and feature spec from the brief.

## Stack

- **Frontend:** Next.js 16 (App Router, Turbopack), Tailwind CSS v4,
  Framer Motion, Lucide React, Zustand (cart state, persisted to
  `localStorage`)
- **Backend:** Next.js Route Handlers (`app/api/**`)
- **Auth:** JWT in an httpOnly cookie (`jose` + `bcryptjs`), no third-party
  auth provider required
- **Database:** see "About the database layer" below

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. The first account you register becomes an
`ADMIN` (there's no admin UI yet — it's just a role flag on the seed data
model, ready to build on).

## About the database layer

`prisma/schema.prisma` is the real, intended data model — `User`,
`Product`, `Order`, `OrderItem`, with proper relations and a Postgres
datasource. That's the schema to run `prisma migrate` against in a normal
environment.

This build was produced in a sandboxed environment that couldn't reach
Prisma's binary CDN or a live Postgres instance, so `lib/db.ts` implements
the identical shape as a small file-backed store (`data/db.json`,
auto-created and seeded on first run) so the app is fully functional
offline. Every function in `lib/db.ts` maps 1:1 to a Prisma call, e.g.:

```ts
// lib/db.ts                          // Prisma equivalent
getProducts({ category })             // prisma.product.findMany({ where: { category } })
createOrder(order)                    // prisma.order.create({ data: { ... } })
getOrdersByUser(userId)                // prisma.order.findMany({ where: { userId } })
```

**To switch to real Postgres:** install `@prisma/client` (already in
`package.json`), set `DATABASE_URL` in `.env`, run
`npx prisma migrate dev`, and swap the bodies of the functions in
`lib/db.ts` for the equivalent `prisma.*` calls. The function signatures
and return shapes were designed to make that a mechanical swap.

## Feature coverage

- Floating blur navbar, animated cart badge, mobile menu
- Bento-grid homepage showcase + bestsellers row
- Shop page: category, price-range, and sort filters + search
- Product detail: image gallery, color/size variants, live stock
  indicator, animated spec/shipping/care accordion, related products
- Slide-out cart drawer: live subtotal/shipping/tax/total, quantity
  controls, animated item removal
- Single-page checkout: validated shipping + simulated payment form
- Auth: register / login / logout, httpOnly JWT session cookie
- Profile page: order history with status tags
- Accessibility: semantic landmarks, ARIA on interactive controls
  (accordion, dialog, tabs, form errors), visible focus rings,
  `prefers-reduced-motion` respected

## Project structure

```
app/
  page.tsx                 Homepage
  shop/page.tsx             Product grid + filters
  product/[id]/page.tsx      Product detail
  checkout/page.tsx          Checkout
  login/, register/          Auth pages
  profile/page.tsx           Order history
  api/
    auth/{register,login,logout,me}/route.ts
    products/route.ts, products/[id]/route.ts
    orders/route.ts
components/                 UI components (Navbar, CartDrawer, ProductCard, ...)
lib/                        db.ts, auth.ts, types.ts, format.ts
store/cart.ts                Zustand cart store
prisma/schema.prisma          Real Postgres schema (see above)
```
