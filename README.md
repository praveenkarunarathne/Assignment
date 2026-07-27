# Ledger Store

A modern, editorial-style e-commerce storefront for curated menswear — built with Vue 3, TypeScript, and Pinia, and powered by the [DummyJSON](https://dummyjson.com) product API.

![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-4-ffd859?logo=pinia&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06b6d4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## Overview

Ledger Store is a single-page e-commerce application featuring a sharp, minimal, editorial design aesthetic (serif display type, generous whitespace, custom cursor interactions). Products are sourced live from the DummyJSON API and curated to a single niche — men's shirts, shoes, and watches — to keep the catalog focused and the browsing experience deliberate.

The app covers the full core shopping flow: browsing, filtering, searching, authentication, and cart management, with persisted state, toast notifications, dark mode, and responsive layouts (including a mobile bottom tab bar).

---

## Features

- **Product catalog** — Live product data fetched from DummyJSON, filtered to a curated menswear selection (shirts, shoes, watches)
- **Search & filtering** — Full-text search across title, description, and brand; category filtering; price range filtering; sorting by price, rating, and name
- **Product detail pages** — Image gallery, stock/availability indicators, shipping & return policy info, ratings, and reviews
- **Authentication** — Login flow against the DummyJSON auth API with persisted session tokens
- **Shopping cart** — Per-user cart persisted to `localStorage`, quantity management, and route guarding (cart requires login)
- **Toast notifications** — Lightweight, auto-dismissing feedback for cart and auth actions
- **Dark mode** — System-preference aware, toggleable, and persisted across sessions
- **Responsive design** — Adaptive layout with a dedicated bottom tab bar for mobile
- **Motion & interaction details** — Scroll-reveal animations, skeleton loading states, custom cursor hover effects, and animated transitions throughout
- **Empty / error / loading states** — Dedicated components for each state across the product grid

---

## Tech Stack

| Layer               | Technology                              |
|----------------------|------------------------------------------|
| Framework            | Vue 3 (`<script setup>` SFCs)            |
| Language             | TypeScript                               |
| Build tool           | Vite                                     |
| State management     | Pinia (composition API stores)           |
| Routing              | Vue Router                               |
| Styling              | Tailwind CSS                             |
| Utilities            | VueUse                                   |
| Type checking        | `vue-tsc`                                |
| Data source          | [DummyJSON](https://dummyjson.com) REST API |

---

## Project Structure

```
├── src/
│   ├── components/            Reusable UI components
│   │   ├── Badge.vue              Status badges (e.g., stock level)
│   │   ├── BottomTabBar.vue       Mobile bottom navigation
│   │   ├── DarkModeToggle.vue     Theme switcher component
│   │   ├── EmptyState.vue         Empty search/filter results
│   │   ├── ErrorState.vue         Generic error display with retry
│   │   ├── Footer.vue             Application footer
│   │   ├── LoadingSpinner.vue     Global loading indicator
│   │   ├── MagneticButton.vue     Interactive button with physics
│   │   ├── NavBar.vue             Top navigation
│   │   ├── PageWrapper.vue        Layout wrapper for pages
│   │   ├── ProductCard.vue        Individual product tile
│   │   ├── ProductFilters.vue     Search, sort, and price controls
│   │   ├── ProductGrid.vue        Grid layout renderer
│   │   ├── SearchBar.vue          Input field for search queries
│   │   ├── SkeletonDetail.vue     Loading state for product details
│   │   ├── StarRating.vue         Visual 5-star rating component
│   │   └── Toast.vue              Toast notification renderer
│   ├── composables/
│   │   └── useScrollReveal.ts     IntersectionObserver-based animations
│   ├── router/
│   │   └── index.ts               Route definitions & auth guards
│   ├── stores/                Pinia stores (state management)
│   │   ├── auth.ts                Login/session/token handling
│   │   ├── cart.ts                Cart lines, persistence, quantity logic
│   │   ├── darkMode.ts            Theme preference & persistence
│   │   ├── products.ts            Catalog, search, filters, sorting
│   │   └── toast.ts               Toast queue
│   ├── types/
│   │   └── index.ts               Shared TypeScript interfaces
│   ├── views/                 Route-level pages
│   │   ├── CartView.vue           Cart management (auth required)
│   │   ├── HomeView.vue           Catalog browsing
│   │   ├── LoginView.vue          Authentication
│   │   ├── NotFoundView.vue       404 fallback page
│   │   └── ProductDetailView.vue  Single product page
│   ├── App.vue                Root component & custom cursor logic
│   ├── env.d.ts               TypeScript environment declarations
│   ├── index.css              Global Tailwind and custom CSS
│   └── main.ts                App entry point
├── package.json               Project metadata and dependencies
├── prompts.txt                AI prompt history log
├── README.md                  Project documentation
├── LICENSE                    MIT License
├── tailwind.config.js         Tailwind CSS configuration
├── tsconfig.json              TypeScript compiler options
└── vite.config.ts             Vite bundler configuration
```

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

```bash
git clone <repository-url>
cd ledger-store
npm install
```

### Development

```bash
npm run dev
```

Starts the Vite dev server with hot module replacement.

### Build

```bash
npm run build
```

Type-checks the project with `vue-tsc` and produces a production build in `dist/`.

### Preview

```bash
npm run preview
```

Serves the production build locally for a final check before deployment.

---

## Demo Credentials

The app authenticates against DummyJSON's public test API. The login form is pre-filled with a working demo account:

| Field    | Value          |
|----------|----------------|
| Username | `emilys`       |
| Password | `emilyspass`   |

---

## Routing

| Path                  | View                  | Notes                        |
|-----------------------|-----------------------|-------------------------------|
| `/`                   | `HomeView`            | Product catalog               |
| `/category/:category` | `HomeView`            | Filtered by category          |
| `/product/:id`        | `ProductDetailView`   | Product detail (lazy-loaded)  |
| `/cart`               | `CartView`            | Requires authentication       |
| `/login`              | `LoginView`           | Redirects back after login    |
| `*`                   | `NotFoundView`        | 404 fallback                  |

---

## State Management

State is organized into focused Pinia stores using the Composition API syntax:

- **`products`** — fetches and caches the catalog, exposes computed `filteredProducts` (search + category + price + sort applied)
- **`cart`** — manages cart lines per authenticated user, persisted to `localStorage`
- **`auth`** — handles login, session restoration, and logout, including clearing cart state on logout
- **`darkMode`** — tracks and persists the active theme, respecting system preference on first load
- **`toast`** — a simple queue for transient success/error/info notifications

---

## Design System

- **Typography** — Fraunces (display/serif) paired with Inter (body) and IBM Plex Mono (accents)
- **Color palette** — Neutral surface/edge/text scales with full light and dark variants, muted beige used for sale/discount indicators instead of red
- **Motion** — Custom fade, slide, and scale keyframes, plus a cart "bounce" animation and shimmer effect for skeleton loading

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.