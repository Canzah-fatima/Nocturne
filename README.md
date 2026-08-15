# 🌑 NOCTURNE

> **A premium full-stack luxury e-commerce platform engineered for performance, security, and modern web architecture.**

NOCTURNE is a production-grade luxury storefront built with **Next.js 15**, **TypeScript**, **Supabase**, **Tailwind CSS**, **Zustand**, and **Framer Motion**. It combines an ultra-minimal aesthetic with enterprise-level backend architecture, featuring secure server-side pricing, atomic order processing, SSR authentication, inventory protection, and hydration-safe client state.

---

## ✨ Preview

> **Minimal. Elegant. Secure.**

* 🛍️ Luxury product catalog
* 🔐 Cookie-based SSR authentication
* 🛒 Persistent shopping cart
* 💳 Secure checkout
* 📦 Inventory management
* ⭐ Dynamic customer reviews
* 📱 Fully responsive design
* ⚡ Fast App Router architecture

---

# 🚀 Features

## 🔒 Enterprise-Level Security

* Zero-trust server-side price validation
* Server-calculated taxes and shipping
* Protected checkout flow
* Inventory verification before payment
* Open redirect protection
* PostgREST injection sanitization
* Secure cookie-based authentication
* Server-only service role credentials

---

## 🛒 Shopping Experience

* Modern luxury storefront
* Category browsing
* Live product search
* Price filtering
* Product variants

  * Colors
  * Sizes
* Persistent shopping cart
* Guest & authenticated checkout
* Responsive product pages

---

## 💳 Secure Checkout

The client only submits:

```text
Product ID
Quantity
Selected Color
Selected Size
```

Everything else is calculated securely on the server:

* Latest product prices
* Inventory availability
* Subtotal
* 5% Sales Tax
* Flat Shipping Fee
* Final Total (PKR)

This completely prevents client-side cart manipulation.

---

## 📦 Inventory Protection

Every order is processed safely using atomic operations.

During checkout:

1. Fetch latest product data
2. Validate stock
3. Calculate totals
4. Create order
5. Create order items
6. Deduct inventory

If **any** step fails, the transaction is rolled back to maintain database consistency.

---

## 👤 Authentication

Powered by **Supabase SSR Authentication**

Features include:

* Cookie-based sessions
* Edge Middleware protection
* Server Components authentication
* Protected profile pages
* Protected checkout
* Persistent login sessions

---

## ⭐ Reviews System

Dynamic review system with:

* Verified buyer badges
* Average rating calculation
* Automatic aggregate updates
* Animated marquee testimonials
* Hover pause animation
* Dynamic PostgreSQL data

---

## 🎨 Design System

NOCTURNE follows an **Obsidian Luxury** design language.

Features include:

* Ultra-minimal UI
* Premium typography
* Soft glow effects
* Glassmorphism accents
* Dark aesthetic
* Smooth animations
* Accessible dialogs
* Responsive layouts

---

# 🏗 Tech Stack

| Category             | Technologies            |
| -------------------- | ----------------------- |
| **Framework**        | Next.js 15 (App Router) |
| **Language**         | TypeScript              |
| **Database**         | PostgreSQL              |
| **Backend**          | Supabase                |
| **Authentication**   | Supabase SSR            |
| **State Management** | Zustand                 |
| **Styling**          | Tailwind CSS            |
| **Animations**       | Framer Motion           |
| **Icons**            | Lucide React            |
| **Deployment**       | Vercel                  |
| **Currency**         | PKR (en-PK)             |

---

# 🏛 Architecture

```text
                    Client Browser
                          │
          ┌───────────────┴────────────────┐
          │                                │
          │                                │
 Navigation                     Shopping Cart
          │                                │
          ▼                                ▼
 Edge Middleware                Zustand Store
 Cookie Validation         Hydration Safe Storage
          │
          ▼
 Protected Routes
          │
          ▼
     Checkout Request
          │
          ▼
   POST /api/orders
          │
          ├──────────────► Fetch Products
          │
          ├──────────────► Validate Inventory
          │
          ├──────────────► Calculate Prices
          │
          ├──────────────► Calculate Tax
          │
          ├──────────────► Create Order
          │
          ├──────────────► Insert Items
          │
          └──────────────► Update Inventory
```

---

# 🗃 Database Schema

## Product

```sql
Product
--------
id
title
description
price
category
stockCount
images
colors
sizes
badge
rating
reviewCount
createdAt
```

---

## Order

```sql
Order
--------
id
userId
totalAmount
currency
status
address
createdAt
```

---

## Order Item

```sql
OrderItem
-------------
id
orderId
productId
title
price
quantity
color
size
image
```

---

## Review

```sql
Review
----------
id
productId
name
text
rating
role
createdAt
```

---

# 🔌 API Endpoints

| Endpoint             | Method | Auth     | Description                 |
| -------------------- | ------ | -------- | --------------------------- |
| `/api/products`      | GET    | ❌        | Fetch products with filters |
| `/api/products/[id]` | GET    | ❌        | Product details             |
| `/api/orders`        | GET    | ✅        | User order history          |
| `/api/orders`        | POST   | Optional | Create secure order         |
| `/api/reviews`       | POST   | Optional | Submit review               |
| `/api/newsletter`    | POST   | ❌        | Newsletter subscription     |

---

# 📂 Project Structure

```text
app/
├── (shop)
├── api/
├── checkout/
├── profile/
├── products/

components/
├── ui/
├── cart/
├── product/
├── layout/

lib/
├── supabase/
├── utils/

store/
├── cart-store.ts

middleware.ts

public/

styles/
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/your-username/nocturne-shop.git

cd nocturne-shop
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env.local` file.

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 4. Start the development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 📜 Available Scripts

```bash
npm run dev
```

Runs the development server.

---

```bash
npm run build
```

Creates an optimized production build.

---

```bash
npm run start
```

Starts the production server.

---

```bash
npm run lint
```

Runs ESLint.

---

# 🔒 Security

NOCTURNE follows a **Zero Trust** architecture.

### ✔ Server-side pricing

Prices are never trusted from the client.

---

### ✔ Inventory validation

Every purchase validates stock before order creation.

---

### ✔ Transaction safety

Orders roll back automatically if any operation fails.

---

### ✔ Secure authentication

* HTTP Cookies
* SSR Authentication
* Middleware Protection

---

### ✔ Input sanitization

Search and filter parameters are cleaned before reaching PostgREST.

---

### ✔ Protected redirects

Only safe internal routes are allowed after login.

---

# 🌍 Localization

* Currency: **Pakistani Rupees (PKR)**
* Locale: **en-PK**
* Localized number formatting
* Localized date formatting

---

# ⚡ Performance Highlights

* Next.js 15 App Router
* React Server Components
* Edge Middleware
* Hydration-safe Zustand persistence
* Optimized client/server rendering
* Dynamic route handlers
* Lazy loading
* Production-ready architecture

---

# 📸 Screenshots

> A quick look at NOCTURNE's user experience.

## 🏠 Home Page

![Home](https://github.com/user-attachments/assets/4a6e35fd-8566-419a-b70d-50f171c50e07)

---

## ✨ Featured Products

<img width="1366" height="637" alt="image" src="https://github.com/user-attachments/assets/74e00625-1c66-4963-bc91-f4fbc8bd638b" />

---

## 🛍️ Product Details

<img width="1364" height="612" alt="image" src="https://github.com/user-attachments/assets/380b0926-438d-4eb5-ae2b-88cf83a8c613" />

---

## 🛒 Shopping Cart

![Shopping Cart](https://github.com/user-attachments/assets/0bb89092-2809-4c47-9366-202b6da48104)

---

## 💳 Checkout

<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/8a008c35-3738-4cb0-ae9d-d7dee0056a99" />

---

## 👤 User Profile

![User Profile](https://github.com/user-attachments/assets/4678b45e-3312-4daf-8f32-deb61ede356e)

---

## ⭐ Customer Reviews

<img width="1366" height="633" alt="image" src="https://github.com/user-attachments/assets/6d466856-d7bd-4102-8eef-30bc3976ee63" />

---

# 🛣 Roadmap

* [ ] Wishlist
* [ ] Stripe Payments
* [ ] Order Tracking
* [ ] Email Notifications
* [ ] Admin Dashboard
* [ ] Coupon System
* [ ] Product Recommendations
* [ ] Recently Viewed Products
* [ ] Dark / Light Theme
* [ ] Multi-language Support

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push your branch

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

---

# 📄 License

Licensed under the **MIT License**.

---

## 👨‍💻 Built With

* Next.js 15
* TypeScript
* Supabase
* PostgreSQL
* Zustand
* Tailwind CSS
* Framer Motion
* Lucide React

---

<p align="center">
  <strong>NOCTURNE</strong><br>
  Crafted with precision, performance, and modern web technologies.
</p>
