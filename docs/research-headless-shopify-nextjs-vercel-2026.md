# Research brief: Headless Shopify on Next.js + Vercel (2025-2026)

**Audience:** Small US niche reseller (marine electronics, ~5-15 SKUs, Florida LLC, domestic stock, ~$2k pilot inventory).  
**Scope:** Primary sources (Shopify, Vercel, Next.js, Hydrogen). Secondary blogs used only for framing, not as facts.  
**Date researched:** 2026-10-08  
**Related:** `docs/context-shopify-us-store.md`

---

## Executive recommendation (pragmatic)

For a **new small US reseller launching with ~$2k of pilot goods**:

| Decision | Recommendation |
| --- | --- |
| Headless vs Online Store 2.0 | Prefer **Online Store 2.0 (theme)** until product-market fit and ops are proven. Headless is justified if brand UX / content site / existing Next.js investment is a hard requirement. |
| If headless on Next.js (this repo) | **Next.js App Router + Headless channel + Storefront Cart API + Shopify-hosted checkout**, starting from [vercel/commerce](https://github.com/vercel/commerce) or a thin custom fork. Use `@shopify/hydrogen-react` optionally for UI primitives. |
| Do **not** pick at launch | Hydrogen + Oxygen (different framework/host), custom checkout, Checkout Kit inline, custom tax/shipping engines, multi-CMS architecture. |
| Checkout (2026 best practice) | Cart API → `checkoutUrl` → **Shopify web checkout**. Customize with Checkout Extensibility / branding, not a rebuilt checkout. |
| Deploy | Vercel + on-demand revalidation webhooks (products/collections). Cache hard; cart/checkout stay dynamic. |

**Why this is not enterprise advice:** At 5-15 SKUs and pilot capital, time-to-first-sale and Shopify admin leverage matter more than framework purity. Headless adds ownership of cart, caching, SEO redirects, and theme-app gaps without buying inventory velocity.

---

## 1. Official stack today: Hydrogen vs Next.js Commerce vs custom Storefront API

### What Shopify officially recommends

Shopify documents three headless build options ([Options for building headless](https://shopify.dev/docs/storefronts/headless/getting-started/build-options)):

| Path | When Shopify points you there |
| --- | --- |
| **Hydrogen** (React Router + Shopify tooling) | Custom storefront with Shopify's fullstack toolkit |
| **Hydrogen React** (`@shopify/hydrogen-react`) | Third-party React framework (e.g. Next.js) using Shopify components/utilities |
| **Headless channel + Storefront API only** | Any framework / backend using GraphQL Storefront API |

Shopify's **recommended headless stack** for Shopify-first builds is **Hydrogen + Oxygen** ([Hydrogen and Oxygen fundamentals](https://shopify.dev/docs/storefronts/headless/hydrogen/fundamentals)):

- Hydrogen = React Router app + Storefront/Customer Account helpers, CLI, caching patterns  
- Oxygen = Shopify edge hosting (included on paid plans; not Agentic plans)  
- Hydrogen channel = storefronts, env vars, deploy logs, order attribution  

For Next.js specifically, Shopify's official bridge is **Hydrogen React**, not Hydrogen-the-framework ([Hydrogen React](https://shopify.dev/docs/api/hydrogen-react)).

### What Vercel officially recommends

Vercel actively maintains **Next.js Commerce** as a Shopify-first App Router template ([Next.js Commerce template](https://vercel.com/templates/next.js/nextjs-commerce), [vercel/commerce README](https://github.com/vercel/commerce)):

- Server Components, Server Actions, Suspense, optimistic UI  
- Shopify is the **actively maintained** commerce provider in that template  
- Step-by-step: [Deploy a headless Shopify storefront with Vercel](https://vercel.com/kb/guide/deploy-headless-shopify-storefront-with-vercel) (updated 2026)

### When headless is worth it for a small store

**Online Store 2.0 is usually enough when:**

- Catalog is small (5-15 SKUs) and static-ish  
- Need: payments, tax, shipping, email, inventory, basic SEO  
- Team bandwidth is commerce/ops, not frontend platform  
- Budget is pilot-scale (~$2k goods)

**Headless is worth it when you need at least one of:**

- Brand/content experience that Liquid themes fight (long-form marine education, install guides, custom kit builders)  
- Unified Next.js marketing + store in one codebase (already the case for this repo)  
- Non-Shopify data fused into PDPs (docs, firmware notes, compatibility matrices)  
- Strong existing Next.js skill / hosting preference (Vercel)

**Honest tradeoff:** Shopify still owns checkout, orders, payments, tax, shipping, and most ops. Headless only replaces the **browse/cart UI layer**. You still pay Shopify subscription and still configure admin the same way.

### Recommendation for Nautic Controls

| Option | Fit |
| --- | --- |
| Online Store 2.0 theme | Fastest launch; default if storefront code is not already a committed investment |
| **Next.js Commerce / custom Storefront API on Vercel** | Best fit **given this repo's direction** and Next.js preference |
| Hydrogen + Oxygen | Only if abandoning Next.js; gains Shopify-native DX, loses Vercel/Next ecosystem |
| Hydrogen React inside Next.js | Useful library layer (money, media, Shop Pay button), not a full stack |
| Hydrogen `@preview` (framework-agnostic / Next) | **Watch only until GA** — see `docs/hydrogen-preview-watch.md`. Not for production yet (API will change). |

**Plan constraint from Vercel:** Next.js Commerce does **not** work on Shopify **Starter** (cannot install custom/headless theme). Need Basic+ ([Vercel KB](https://vercel.com/kb/guide/deploy-headless-shopify-storefront-with-vercel)).

---

## 2. Storefront API + Cart API + Checkout (2026 best practice)

### Cart API is mandatory

Legacy Checkout APIs were deprecated (2024-04) and sunset (2025-04). Current path is Storefront **Cart API** → Shopify web checkout ([Migrate to the Storefront Cart API](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/migrate-to-cart-api)).

Benefits Shopify calls out: GraphQL efficiency, client+server use, bot protection, contextual pricing, discounts, bundles, subscriptions, Shopify Functions + UI extensions via hosted checkout.

### Canonical headless checkout flow

Documented flow ([Create and update a cart](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage)):

1. `cartCreate` / `cartLinesAdd` / `cartLinesUpdate`  
2. Optional `cartBuyerIdentityUpdate` (email, country, preferences, `customerAccessToken`)  
3. Query `cart.checkoutUrl` **when the buyer is ready to pay** (re-request if stale)  
4. Redirect to Shopify-hosted checkout  

**Cost caveat:** Cart `cost` is an **estimate**. Final tax/shipping appear at checkout ([Cart manage docs](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage)).

**Security caveats:**

- Cart ID includes a secret `?key=`; never put the secret in shareable URLs ([Cart manage](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage))  
- Server-side buyer requests should send `Shopify-Storefront-Buyer-IP` with private tokens or logged-in checkout can degrade ([Storefront API](https://shopify.dev/docs/api/storefront/latest))

### Hosted checkout vs Checkout Extensibility vs Hydrogen checkout

| Approach | Role in 2026 |
| --- | --- |
| **Shopify-hosted web checkout** | Default for headless web. Hydrogen also redirects here ([Migrate OS → Hydrogen](https://shopify.dev/docs/storefronts/headless/hydrogen/migrate)) |
| **Checkout Extensibility** (UI extensions, Functions, pixels, payments extensions) | Customize hosted checkout without `checkout.liquid` ([Apps in checkout](https://shopify.dev/docs/apps/build/checkout)). Note: UI extensions on info/shipping/payment steps are **Plus-only** for many targets ([Checkout UI extensions](https://shopify.dev/docs/api/checkout-ui-extensions/latest)) |
| **Checkout Kit for Web** | Embed checkout (tab/popup/inline) using `checkoutUrl` ([Checkout Kit for Web](https://shopify.dev/docs/storefronts/mobile/checkout-kit/web)). Inline needs auth JWT; CSP/cookie complexity. **Not needed for launch.** |
| Custom checkout rebuild | Not supported / not recommended; Checkout APIs are gone |

### Domain pattern for checkout

Shopify expects a **checkout subdomain** pointed at Online Store (primary), while the headless storefront owns the apex/primary browsing domain ([Redirect traffic](https://shopify.dev/docs/storefronts/headless/hydrogen/migrate/redirect-traffic), [Migrate](https://shopify.dev/docs/storefronts/headless/hydrogen/migrate)):

- Example: `nauticcontrols.com` → Vercel (Next.js)  
- `checkout.nauticcontrols.com` → Shopify (Online Store target, domain type Primary)  
- For non-Oxygen hosts, **only the checkout subdomain must point to Shopify**

Also: Online Store **password protection blocks checkouts** for headless/Hydrogen ([Migrate](https://shopify.dev/docs/storefronts/headless/hydrogen/migrate)).

### Auth tokens

Install **Headless** (or Hydrogen) channel; get public + private Storefront tokens ([Getting started](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started), [Build options](https://shopify.dev/docs/storefronts/headless/getting-started/build-options)):

- Public: browser (`X-Shopify-Storefront-Access-Token`)  
- Private: server only (`Shopify-Storefront-Private-Token`)  
- Prefer private token from Next.js Server Components / Route Handlers  

### Best practice for this brand (2026)

1. Server-side Cart API with private token  
2. Cookie-store cart id (full id with key, httpOnly if possible)  
3. Redirect to `checkoutUrl` (full page)  
4. Brand Shopify checkout + emails in admin (Vercel guide steps 4-6)  
5. Skip Checkout Kit / custom checkout until conversion data demands it  
6. Use Checkout Extensibility only for must-have Plus features later; Basic branding + Shop Pay is enough at pilot scale  

---

## 3. Vercel deployment patterns for Shopify commerce

Primary guide: [Deploy a headless Shopify storefront with Vercel](https://vercel.com/kb/guide/deploy-headless-shopify-storefront-with-vercel).

### Required Shopify setup (Vercel Commerce path)

1. Shopify plan that allows custom themes (not Starter)  
2. Install **Headless theme**; set storefront domain in theme settings; publish  
3. Install **Headless** app → create storefront → copy public Storefront token  
4. Brand checkout, order status, emails, favicon in Shopify admin  
5. Webhooks → Next.js revalidation endpoint with shared secret  

### Environment variables (canonical)

From Vercel KB:

| Var | Purpose |
| --- | --- |
| `SHOPIFY_STORE_DOMAIN` | `xxx.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Headless channel public token |
| `SHOPIFY_REVALIDATION_SECRET` | Secures webhook → revalidate route |
| `SITE_NAME` / social meta vars | Brand + OG |

Also store **private** Storefront token server-only if not using the template's public-only pattern (recommended for buyer-IP / logged-in flows). Use Vercel Environment Variables per environment (Production / Preview / Development).

### ISR + webhooks (core pattern)

Next.js Commerce listens for ([Vercel KB](https://vercel.com/kb/guide/deploy-headless-shopify-storefront-with-vercel)):

- `collections/create|update|delete`  
- `products/create|update|delete` (includes variant + inventory purchase updates)

Pattern:

1. Tag Storefront fetches (`products`, `collections`, or per-handle tags)  
2. Webhook Route Handler verifies secret (or HMAC)  
3. `revalidateTag(tag, 'max')` for stale-while-revalidate ([Next.js revalidating](https://nextjs.org/docs/app/getting-started/revalidating), [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag))  
4. Use immediate expire only for hard removals (`{ expire: 0 }`)

Vercel ISR: stale-while-revalidate, request collapsing, global purge ~300ms ([ISR docs](https://vercel.com/docs/incremental-static-regeneration)). On-demand revalidation is **per domain/deployment** (preview vs prod need separate webhook URLs).

Local webhook testing: ngrok (or similar) as documented in the Vercel KB.

### Edge / runtime

- Prefer **Node/server runtime** for Storefront private-token cart mutations unless you have a clear Edge need  
- Cache **catalog pages** (home, collection, PDP); keep **cart/checkout redirect** dynamic  
- Do not put a reverse proxy in front of Oxygen if you ever use it (Oxygen disallows proxies for bot/SEO reasons) ([Hydrogen fundamentals](https://shopify.dev/docs/storefronts/headless/hydrogen/fundamentals)). Vercel-hosted Next.js is fine with normal DNS.

### Domains

- Apex/`www` → Vercel project  
- `checkout.` subdomain → Shopify (Online Store)  
- Update notification URLs / product feeds to headless domain ([Migrate](https://shopify.dev/docs/storefronts/headless/hydrogen/migrate))  

---

## 4. Product / catalog / inventory for low-SKU specialty hardware

### Model the catalog simply

For marine electronics kits (~5-15 sellable SKUs):

| Sellable | Shopify modeling |
| --- | --- |
| Board / module alone | Single product, 1 variant (or options only if real) |
| Turnkey kit (board + enclosure + connectors) | **Fixed bundle** parent OR single SKU with BOM in metafields + inventory of a "kit" SKU |
| Spare component | Separate product; publish only if you sell it alone |
| "Hidden" merchandising groups | Collections (Commerce template uses `Hidden: Homepage …` naming) ([Vercel KB](https://vercel.com/kb/guide/deploy-headless-shopify-storefront-with-vercel)) |

### Bundles (official)

Shopify supports ([Start building bundles](https://shopify.dev/docs/apps/build/product-merchandising/bundles/start-building)):

| Type | Oversell protection | Headless note |
| --- | --- | --- |
| **Fixed bundles** (`productBundleCreate` / variant components) | Parent sellable qty = min of component inventories | Parent variant add-to-cart; works without Liquid; Storefront can read sellable qty |
| **Customized bundles** (`cartTransform` Functions) | App maintains OOS on storefront; components checked in cart/checkout | Needs custom PDP picker; more engineering |

Limits (fixed): up to 30 components, up to 3 options, **no nested bundles** ([Add product fixed bundle](https://shopify.dev/docs/apps/build/product-merchandising/bundles/add-product-fixed-bundle)).

**Pilot recommendation:** Prefer **fixed kits as single sellable SKUs** with clear titles ("SH-ESP32 Kit") and track physical components in a spreadsheet / metafield BOM until volume justifies Shopify Bundles app complexity. If true component inventory must gate kit sales, use **fixed bundles** so Shopify computes parent availability.

### Inventory ops (US domestic, Florida)

- One fulfillment location (Florida) first  
- Track inventory on Shopify; `products/update` webhook refreshes OOS state on the headless site  
- Publish products only to the **Headless** channel (and Online Store if you keep redirects/checkout theme)  
- Draft vs Active: Commerce only shows Active products ([Vercel KB](https://vercel.com/kb/guide/deploy-headless-shopify-storefront-with-vercel))  
- Use product **categories** for Shopify Tax accuracy ([Shopify Tax](https://help.shopify.com/en/manual/taxes/shopify-tax))  
- Metafields for: compatibility, firmware docs URL, HAT Labs SKU, HS code / country of origin (ops), kit contents  

Avoid: nested kits, selling both loose components and kits without inventory rules, multi-location until volume requires it.

---

## 5. SEO, performance, caching (App Router)

### SEO

**Shopify still provides SEO fields** for products/collections/pages; Next.js Commerce maps them with fallbacks ([Vercel KB](https://vercel.com/kb/guide/deploy-headless-shopify-storefront-with-vercel)).

Next.js App Router:

- `generateMetadata` for title/description/OG per PDP ([generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images))  
- Memoize product fetch shared by page + metadata  
- JSON-LD Product/Offer (Offer availability from inventory)  
- Canonical URL = headless primary domain (never checkout subdomain)  
- `sitemap.xml` / `robots.txt` on the Next.js app  
- Redirect `{shop}.myshopify.com` / Online Store paths to headless to avoid duplicate indexing ([Redirect traffic](https://shopify.dev/docs/storefronts/headless/hydrogen/migrate/redirect-traffic))  
- Align Google/Facebook product feed URLs to headless domain ([Migrate](https://shopify.dev/docs/storefronts/headless/hydrogen/migrate))  
- Prefer `/products/:handle` or server-redirect from that path ([Hydrogen fundamentals](https://shopify.dev/docs/storefronts/headless/hydrogen/fundamentals))  

Hydrogen SEO utilities (`getSeoMeta`) are Remix/Hydrogen-specific ([Hydrogen SEO](https://shopify.dev/docs/storefronts/headless/hydrogen/seo)); on Next.js, use Metadata API instead.

### Performance / caching

| Layer | Practice |
| --- | --- |
| Catalog | Cache indefinitely + webhook `revalidateTag` ([Next.js revalidating](https://nextjs.org/docs/app/getting-started/revalidating)) |
| Images | `next/image` + Shopify CDN URLs |
| Cart | No long cache; cookie-bound; mutations via Server Actions |
| Checkout | Shopify-hosted; do not SSR checkout |
| JS | RSC-first; avoid shipping a second cart client store if Server Actions suffice |
| Storefront API | Private token server-side; buyer IP on buyer-driven requests |

At 5-15 SKUs, **prebuild all PDPs** at deploy; webhooks keep them fresh. Time-based revalidate is a backup, not the primary strategy ([Vercel on-demand guide](https://vercel.com/kb/guide/how-to-move-to-on-demand-revalidation)).

---

## 6. Common pitfalls for small merchants going headless

1. **Headless for vanity** - Paying eng weeks to reimplement a theme when stock and demand are unproven.  
2. **Wrong Shopify plan** - Starter blocks Headless theme / Commerce setup ([Vercel KB](https://vercel.com/kb/guide/deploy-headless-shopify-storefront-with-vercel)).  
3. **Password gate left on** - Blocks checkout ([Migrate](https://shopify.dev/docs/storefronts/headless/hydrogen/migrate)).  
4. **Duplicate SEO** - Online Store + headless both live without redirects/canonicals.  
5. **Checkout domain misconfigured** - Missing `checkout.` subdomain / wrong domain target.  
6. **Using sunset Checkout APIs** - Must be Cart API ([Migrate to Cart API](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/migrate-to-cart-api)).  
7. **Missing buyer IP on server cart calls** - Throttling / bot / auth checkout issues ([Storefront API](https://shopify.dev/docs/api/storefront/latest)).  
8. **Leaking private token or cart key** - Treat both as secrets.  
9. **Stale inventory** - Webhooks not wired for preview+prod; OOS after pilot sells out.  
10. **Theme-only apps** - Many App Store apps inject Liquid/theme app extensions; they **will not appear** on a headless storefront. Prefer admin/checkout/Shopify Functions apps.  
11. **Checkout UI extensions assuming Plus** - Many checkout UI targets are Plus-gated ([Checkout UI extensions](https://shopify.dev/docs/api/checkout-ui-extensions/latest)).  
12. **Cart webhooks expectation** - Storefront Cart API does **not** fire `cart/create` or `cart/update` webhooks ([Migrate notes](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/migrate-to-cart-api)). Use order webhooks for post-purchase.  
13. **Overbuilding bundles/search/CMS** - Not needed for 15 SKUs.  
14. **Ignoring emails/order status branding** - Those pages stay on Shopify even when the storefront is Next.js ([Vercel KB](https://vercel.com/kb/guide/deploy-headless-shopify-storefront-with-vercel)).

---

## 7. Shopify apps/features you still need when headless

Headless does **not** replace the commerce back office. You still configure:

| Need | Use (small US store) | Notes |
| --- | --- | --- |
| Payments | **Shopify Payments** (+ Shop Pay) | Hosted checkout; Shop Pay button via Hydrogen React or checkout |
| Tax | **Shopify Tax** / US tax setup | [US taxes](https://help.shopify.com/en/manual/taxes/us), [Shopify Tax](https://help.shopify.com/en/manual/taxes/shopify-tax); set product categories; Florida nexus advice from a CPA |
| Shipping | Shipping profiles / rates by market | Contiguous US: **$9.95** under $75, free at $75+; other destinations contact for quote (`docs/plans/2026-10-08-shipping-rates.md`). Labels via Shopify Shipping |
| Inventory | Shopify inventory + location | Webhooks keep storefront in sync |
| Email | Shopify notification templates | Brand in admin; update notification URLs to headless domain |
| Fraud | Shopify Protect / Payments risk | Checkout-native |
| Analytics | Shopify analytics + channel attribution | Headless channel attribution ([Build options](https://shopify.dev/docs/storefronts/headless/getting-started/build-options)) |
| Checkout branding | Checkout & accounts editor | Non-Plus: branding; Plus: deeper UI extensions |
| Customer accounts | New Customer Accounts (optional at pilot) | Can defer; guest checkout first |
| Reviews / support | Often need **headless-capable** apps or native embeds | Theme app blocks won't show on Next.js |
| Bundles | Shopify Bundles / fixed bundle API | Only when component inventory must gate kits |
| Legal | Policies (shipping, returns, privacy) as Shopify pages or Next routes | Commerce maps Shopify pages to `[page]` |

**Defer:** Avalara/TaxJar, ERP connectors, subscription apps, headless CMS, search SaaS (Algolia), loyalty platforms.

---

## Launch playbook (pilot-scale, Next.js path)

Aligned with `docs/context-shopify-us-store.md` ops order:

1. Shopify **Basic+** store, Florida LLC billing, Shopify Payments  
2. Headless channel + Headless theme; checkout subdomain DNS  
3. Contiguous US shipping (**done:** $9.95 / free $75+); Shopify Tax for registered states; product tax categories  
4. Create 5-15 Active products (kits as simple SKUs first); publish to Headless  
5. Fork/deploy [vercel/commerce](https://github.com/vercel/commerce) or slim Storefront client; set env vars on Vercel  
6. Wire 6 product/collection webhooks (prod + preview)  
7. Brand checkout + emails; remove store password  
8. Soft launch: real inventory, Guest checkout, Shop Pay, no custom checkout  
9. Only then consider fixed bundles, Customer Accounts, Checkout Kit, Hydrogen React polish  

### If schedule slips

Ship an Online Store 2.0 theme for week-1 sales; keep Next.js as a parallel brand site. Carts can be shared across channels when the same products are published ([Migrate / shared carts](https://shopify.dev/docs/storefronts/headless/hydrogen/migrate)).

---

## Source index (primary)

| Topic | URL |
| --- | --- |
| Headless build options | https://shopify.dev/docs/storefronts/headless/getting-started/build-options |
| Hydrogen + Oxygen | https://shopify.dev/docs/storefronts/headless/hydrogen/fundamentals |
| Hydrogen React | https://shopify.dev/docs/api/hydrogen-react |
| Storefront API | https://shopify.dev/docs/api/storefront/latest |
| Building with Storefront API | https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api |
| Cart manage | https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage |
| Migrate to Cart API | https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/migrate-to-cart-api |
| Checkout apps / extensibility | https://shopify.dev/docs/apps/build/checkout |
| Checkout UI extensions | https://shopify.dev/docs/api/checkout-ui-extensions/latest |
| Checkout Kit Web | https://shopify.dev/docs/storefronts/mobile/checkout-kit/web |
| OS → Hydrogen migrate / domains | https://shopify.dev/docs/storefronts/headless/hydrogen/migrate |
| Redirect traffic / domains | https://shopify.dev/docs/storefronts/headless/hydrogen/migrate/redirect-traffic |
| Bundles overview | https://shopify.dev/docs/apps/build/product-merchandising/bundles/start-building |
| Fixed product bundles | https://shopify.dev/docs/apps/build/product-merchandising/bundles/add-product-fixed-bundle |
| Vercel Shopify deploy | https://vercel.com/kb/guide/deploy-headless-shopify-storefront-with-vercel |
| Next.js Commerce | https://vercel.com/templates/next.js/nextjs-commerce |
| vercel/commerce | https://github.com/vercel/commerce |
| Vercel ISR | https://vercel.com/docs/incremental-static-regeneration |
| Next.js revalidateTag | https://nextjs.org/docs/app/api-reference/functions/revalidateTag |
| Next.js generateMetadata | https://nextjs.org/docs/app/api-reference/functions/generate-metadata |
| Shopify Tax (Help) | https://help.shopify.com/en/manual/taxes/shopify-tax |
| US tax setup (Help) | https://help.shopify.com/en/manual/taxes/us/us-tax-setup |
| Shipping profiles (Help) | https://help.shopify.com/en/manual/fulfillment/setup/shipping-profiles |
