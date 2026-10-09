# Context: Nautic Controls Shopify Store (US Reseller)

## Intent

Build **Nautic Controls** as a US-facing ecommerce brand for **marine and RV electronics** (boards, kits, NMEA 2000 / Signal K gear, accessories).

- **Market:** Buyers who want US stock, USD checkout, and domestic shipping.
- **Catalog:** Multi-brand. Hat Labs is one manufacturer line in the assortment; more brands will be added over time.
- **Storefront:** Shopify Admin for catalog/checkout; headless Next.js in this repo for browse / PDP / cart.
- **Public positioning:** See [`context-brand-and-catalog.md`](context-brand-and-catalog.md).

Pilot Hat Labs PO and supplier terms remain in internal docs (`context-hat-labs-partnership.md`, `draft-pilot-order-analysis.md`). Keep sourcing detail out of customer-facing copy.

## This Repository

| Piece | Role |
| --- | --- |
| This Next.js app (`/private/var/www/nauticcontrols`) | Headless Shopify storefront (App Router + Storefront API) |
| Shopify Admin | Product catalog, inventory, checkout, payments, shipping |
| `docs/context-brand-and-catalog.md` | Public brand and catalog rules |
| `docs/context-hat-labs-partnership.md` | Internal Hat Labs supplier terms, pricing, pilot PO |
| `docs/moskalyk-2026-09-25.csv` / `.pdf` | Confirmed Hat Labs wholesale price list (2026-09-25) |
| `docs/reseller-annex.pdf` / `reseller-terms.pdf` | Draft Hat Labs contract pack (v0.2) |

## Launch Constraint Order

Commerce code alone does not unblock sales. Order of operations:

1. Entity + insurance / supplier annex items as required for first manufacturer lines
2. Signature-ready supplier agreements where needed
3. Confirm pilot quantities + payment for first stock
4. Goods available → Shopify products + inventory
5. Storefront goes live against real catalog

Detail checklist for Hat Labs lives in `context-hat-labs-partnership.md` §9.
