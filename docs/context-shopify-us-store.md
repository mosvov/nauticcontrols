# Context: Nautic Controls Shopify Store (US Reseller)

## Intent

Build **Nautic Controls** as a US-facing ecommerce brand that resells **Hat Labs Oy** marine electronics from domestic Florida inventory.

- **Supplier market:** Hat Labs sells from Finland (`shop.hatlabs.fi`). Direct US shipping typically takes ~2 weeks and adds high international freight / customs friction on small orders.
- **Our market:** Stock in the US, fulfill via Shopify (headless Next.js storefront in this repo), ship domestically in 2–4 days, avoid surprise import fees for end customers.
- **Pilot capital:** Order **€1,864.83** goods (~**$2,051** @ 1.10; ~**$2,200–2,250** all-in with freight) — kit-balanced mix in `context-hat-labs-partnership.md` §6 and `draft-pilot-order-analysis.md`.
- **Model:** Buy wholesale EUR, land in Florida, resell USD for profit — primarily as boards and turnkey kits (enclosure + connectors), not bare Finland dropship.

## This Repository

| Piece | Role |
| --- | --- |
| This Next.js app (`/private/var/www/nauticcontrols`) | Headless Shopify storefront (App Router + Storefront API) |
| Shopify Admin | Product catalog, inventory, checkout, payments, shipping |
| `docs/context-hat-labs-partnership.md` | Supplier terms, pricing, pilot PO, compliance |
| `docs/moskalyk-2026-09-25.csv` / `.pdf` | Confirmed wholesale price list (2026-09-25) |
| `docs/reseller-annex.pdf` / `reseller-terms.pdf` | Draft contract pack (v0.2) |

## Launch Constraint Order

Commerce code alone does not unblock sales. Order of operations:

1. Florida entity + Annex §1 fields complete
2. CGL insurance ($1M) with Hat Labs as Additional Insured
3. Signature-ready Reseller Terms + Annex (currently **DRAFT**)
4. Confirm pilot quantities + pro-forma + EUR wire
5. Goods land → Shopify products + inventory
6. Storefront goes live against real catalog

Detail checklist lives in `context-hat-labs-partnership.md` §9.
