# Catalog & SEO Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Finish the post-catalog polish that closes the gap vs Hat Labs and prepares the Headless storefront for soft launch.

**Architecture:** Shopify Admin remains source of truth (collections, menus, pages, vendor, metafields). Next.js Commerce already reads menus by handle and collections by handle; no storefront code changes required for Steps 1–6 unless page routes are missing.

**Tech Stack:** Shopify Admin GraphQL / MCP, Next.js Commerce storefront, Vercel (later).

**Store:** `dev-store-749237498237499137`

---

### Task 1: Collection SEO

**Where:** Shopify Admin via `collectionUpdate` (SEO + body description)

**Collections to update:**

| Handle | SEO title | SEO description angle |
| --- | --- | --- |
| `kits` | Signal K Kits US Stock \| Nautic Controls | Gateway + engine kits, Florida shipping |
| `development-boards` | Marine Dev Boards US Stock \| Nautic Controls | SH-ESP32, HALMET bare boards |
| `marine-computers` | Marine Computers US Stock \| Nautic Controls | HALPI2 CM5 |
| `accessories` | Marine Enclosures & Connectors \| Nautic Controls | PW, SP13, N2K |
| `nmea-2000` | NMEA 2000 Gear US Stock \| Nautic Controls | Boards + connectors for N2K |

Also add short HTML body descriptions for collection pages.

**Done when:** Each of the 5 buyer-facing collections has `seo.title` + `seo.description` set.

---

### Task 2: Vendor = Hat Labs

**Where:** `productUpdate` vendor field on all 12 products

**Done when:** Every sellable product has `vendor: "Hat Labs"` (store brand stays Nautic Controls).

---

### Task 3: Delete leftover sample collections

**Delete (empty / sample leftovers):**

- `Hydrogen` (`gid://shopify/Collection/312712462383`)
- `Automated Collection` (`gid://shopify/Collection/312712429615`)

**Keep:**

- `Home page` / `frontpage` (may still be used; leave unless confirmed unused)
- All Hidden + Kits / Boards / Computers / Accessories / NMEA 2000

**Done when:** Hydrogen and Automated Collection are gone.

---

### Task 4: Wire Next.js menus

**Handles (already expected by code):**

- Header: `next-js-frontend-header-menu`
- Footer: `next-js-frontend-footer-menu`

**Header items:**

1. Kits → `/collections/kits`
2. Boards → `/collections/development-boards`
3. Computers → `/collections/marine-computers`
4. Accessories → `/collections/accessories`
5. NMEA 2000 → `/collections/nmea-2000`

**Footer items:**

1. Shipping → `/pages/shipping` (after Task 6)
2. Returns & Warranty → `/pages/returns-warranty`
3. About → `/pages/about`
4. FCC / Responsible Party → `/pages/fcc-responsible-party`
5. Search → `/search`

**Done when:** Both menus exist with those items; navbar/footer resolve them via Storefront API.

---

### Task 5: Product metafields

**Namespace:** `nautic` (custom)

| Key | Type | Purpose |
| --- | --- | --- |
| `docs_url` | url | Link to install / product docs |
| `invoice_sku` | single_line_text | Hat Labs / invoice SKU |
| `warranty` | single_line_text | Short warranty blurb |
| `fcc_note` | multi_line_text | FCC / responsible party note (HALPI2 especially) |

**Done when:** Definitions exist; kits + boards + HALPI2 populated (accessories optional).

---

### Task 6: Policy pages

Create published Online Store pages:

1. Shipping
2. Returns & Warranty
3. About
4. FCC / Responsible Party

Copy should mention Florida fulfillment, RigSense LLC, and DIY kit nature.

**Done when:** All 4 pages published; footer menu links work.

---

### Task 7: FAQ / install snippets on kits

Append a short FAQ section to:

- Signal K Gateway Kit
- Engine Monitoring Kit

Cover: what is included, DIY vs finished gateway, firmware path, US stock.

**Done when:** Both kit descriptions include an FAQ block.

---

### Task 8: Weight / shipping profiles

**Audit:** Confirm each variant has weight in grams; note which shipping profile Shopify assigns.

**Done when:** Spreadsheet or short note in this plan of weights + any gaps. Rate setup may need Admin UI (shipping zones).

**Follow-up (2026-10-08):** Rates live on General profile - $9.95 under $75 / free $75+ contiguous US. See `docs/plans/2026-10-08-shipping-rates.md`.

---

### Task 9: Vercel env + revalidate webhooks (gate)

**Blocked until you ask** (needs Vercel dashboard + Admin webhooks).

1. Set Vercel env keys from `.env.local`
2. Webhooks → `/api/revalidate?secret=...`
3. Smoke: product edit → storefront updates

**Done when:** Live site reflects Admin catalog edits.

---

### Deferred (not in this plan)

- Assembled kit photography
- Florida warehouse location + real inventory after goods land
- Shopify Payments / paid plan / eBay

---

### Execution order

1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → (9 when ready)

Commit docs after each major batch if requested.

---

## Progress (2026-10-08)

| Task | Status | Notes |
| --- | --- | --- |
| 1 Collection SEO | Done | Kits, Boards, Computers, Accessories, NMEA 2000 |
| 2 Vendor = Hat Labs | Done | All 12 products |
| 3 Delete sample collections | Done | Hydrogen + Automated Collection removed; kept frontpage |
| 4 Menus | Done | Header: Kits/Boards/Computers/Accessories/NMEA 2000; footer: policy pages |
| 5 Metafields | Already done | Definitions + values already on catalog |
| 6 Policy pages | Already done | shipping, returns, about, fcc published |
| 7 Kit FAQs | Done | Gateway + Engine kits |
| 8 Weights | Done | Grams set. Rates: $9.95 under $75 / free $75+ contiguous US (`docs/plans/2026-10-08-shipping-rates.md`) |
| 9 Vercel + webhooks | Gated | Wait for explicit ask |

### Weights applied (grams)

| SKU | g |
| --- | ---: |
| KIT-GATEWAY-ESP32 | 400 |
| KIT-ENGINE-HALMET | 500 |
| DEV-SHESP32-2 | 80 |
| DEV-HALMET-1 | 100 |
| MOD-SHRPI-2 | 120 |
| COM-HALPI2-04-256 | 800 |
| ECK-PW100-FH | 150 |
| ECK-PW158-H | 200 |
| CX-M12-PM5A-PW200 | 50 |
| CXP-SP13-CF2/CF5/CM4 | 40 each |
