# Nautic Controls Shop Launch — Ops Checklist

**Date:** 2026-10-08  
**Store:** `dev-store-749237498237499137.myshopify.com`  
**Storefront:** https://www.nauticcontrols.com/  
**Full plan:** Cursor plan `nautic_shop_launch`

## Architecture (locked)

- Shopify Admin = catalog, inventory, checkout, payments
- Next.js on Vercel = browse / PDP / cart (this repo)
- Cart API → Shopify hosted `checkoutUrl`
- eBay later via Marketplace Connect (not custom sync)
- Brand: multi-brand marine/RV reseller (see `docs/context-brand-and-catalog.md`). Hat Labs pilot SKUs are phase-1 catalog; more brands land later.

## Phase 0 — Wiring

- [x] Headless sales channel + Storefront tokens created
- [x] Local `.env.local` (gitignored): domain, public token, revalidation secret, site names
- [x] Local smoke: homepage 200 (Signal K copy), Storefront cartCreate → checkoutUrl
- [x] Headless theme zip ready at `docs/shopify-headless-theme.zip`
- [ ] Vercel env (same keys) — **deferred until you ask**
- [ ] Headless theme uploaded/published (needs Admin login — see `docs/admin-setup-checklist.md`)
- [ ] Webhooks → `/api/revalidate` (after Vercel env)
- [x] Florida Warehouse location + General profile origin (Shop location unused / no online fulfillment)
- [ ] Replace demo snowboard catalog with Nautic seed CSV import

### Env keys (values only in `.env.local` / Vercel UI)

```
COMPANY_NAME
SITE_NAME
SHOPIFY_STORE_DOMAIN
SHOPIFY_STOREFRONT_ACCESS_TOKEN   # public Headless token
SHOPIFY_REVALIDATION_SECRET
```

Private Storefront token is optional for current Commerce template (not read by code yet).

## Phase 1 — Catalog

Sellable offers (kits first):

| Shopify SKU / handle idea | Title | Price USD | Notes |
| --- | --- | ---: | --- |
| KIT-GATEWAY-ESP32 | Signal K Gateway Kit | 89.99 | SH-ESP32 + PW100 + M12 (+ USB later) |
| KIT-ENGINE-HALMET | Engine Monitoring Kit | 169.99 | HALMET + PW158 + SP13 CF2 |
| DEV-SHESP32-2 | SH-ESP32 Board | 49.00 | Bare |
| DEV-HALMET-1 | HALMET Board | 59.00 | Bare |
| MOD-SHRPI-2 | SH-RPi | 79.00 | Bare |
| COM-HALPI2-04-256 | HALPI2 4GB/256GB | 449.00 | Demo / flagship |
| ECK-PW100-FH | Enclosure 100×68×50 | 15–25 | Spare |
| ECK-PW158-H | Enclosure 158×90×60 | 15–25 | Spare |
| CX-M12-PM5A-PW200 | N2K M12 panel pigtail | 15–25 | Spare |
| CXP-SP13-CF2-PW200 | SP13 2-pin pair | 15–25 | Spare |

Collections (exact titles for Next.js Commerce):

- `Hidden: Homepage Featured Items`
- `Hidden: Homepage Carousel`

Menus:

- `Next.js Frontend Header Menu`
- `Next.js Frontend Footer Menu`

Pages: Shipping, Returns & Warranty, About, FCC / Responsible Party.

**Publish every sellable product to the Headless sales channel.**

## Phase 2 — Go-live gate (manual / after stock)

- [x] Contiguous US shipping: **$9.95** under $75, **free** at $75+; other destinations contact for quote (`docs/plans/2026-10-08-shipping-rates.md`)
- [ ] Goods received and counted at Florida location
- [ ] Upgrade store to Shopify **Basic+**
- [ ] Enable Shopify Payments (Nautic Controls)
- [ ] Shopify Tax for registered states (FL registration TBD)
- [ ] Set real inventory quantities
- [ ] Kits Active only with firmware path + install guide
- [ ] Smoke: real checkout under $75 ($9.95 ship) and ≥ $75 (free ship), then refund
- [ ] Remove coming-soon gate on homepage
- [ ] Soft-launch to waitlist / communities

## Phase 3 — eBay

- [ ] Marketplace Connect (requires paid plan)
- [ ] Connect [v.moskalyk](https://www.ebay.com/usr/v.moskalyk); prefer rename to brand username if available
- [ ] Map Florida location; Stock Level + Buffer 1
- [ ] List finished kits only; Custom Label = Shopify SKU
- [ ] Fulfill only in Shopify

## Parallel marketing (Phase 1 of GTM)

See `docs/plan-90-day-marketing.md`. Start:

1. Enter 4–5 communities as practitioner (no pitch for 2+ weeks)
2. Flagship build-log outline (engine kit install)
3. Lead magnet: NMEA 2000 refit checklist + waitlist capture
4. Disambiguate vs “Nauti-Control” on forums when announcing

## Security note

Storefront tokens were shared in chat during setup. Rotate the private token in Headless after go-live if desired. Never commit `.env.local`.
