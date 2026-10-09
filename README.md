# Nautic Controls - Headless Shopify Storefront

A high-performance Next.js App Router ecommerce storefront for **Nautic Controls**, utilizing Shopify as a headless commerce backend.

## Features

- **Next.js 15 App Router**: Server Components, Server Actions, Dynamic Routes, and Cache Optimization.
- **Shopify Storefront API** (`2026-10`): GraphQL queries and mutations for products, collections, cart, checkout, and menus. Version pinned in `lib/constants.ts`.
- **Optimistic Cart UI**: Instant feedback on cart additions and removals.
- **Tailwind CSS v4**: Modern, responsive styling with dark mode support.
- **SEO & Metadata**: Dynamic OpenGraph images, sitemap generation, and JSON-LD structured data.

## Getting Started

### 1. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set your Shopify Storefront API credentials:

```env
COMPANY_NAME="Nautic Controls"
SITE_NAME="Nautic Controls"
SHOPIFY_STORE_DOMAIN="[your-store-subdomain].myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="[your-storefront-access-token]"
# Optional server-only private token (preferred). Cart calls send Buyer-IP.
SHOPIFY_STOREFRONT_PRIVATE_TOKEN="[optional-private-token]"
SHOPIFY_REVALIDATION_SECRET="[your-webhook-secret]"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the storefront.

### 4. Verify Storefront API

```bash
node --env-file=.env.local scripts/verify-storefront.mjs
```

### 5. Hydrogen preview (watch only)

Framework-agnostic `@shopify/hydrogen@preview` is **not** used in production yet. Track stability and adoption criteria in [`docs/hydrogen-preview-watch.md`](docs/hydrogen-preview-watch.md).

### 6. Build for Production

```bash
npm run build
npm start
```
