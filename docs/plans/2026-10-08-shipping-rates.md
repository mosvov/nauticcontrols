# Shipping rates + tax + checkout smoke (Nautic Controls)

**Date:** 2026-10-08 (reverted to contiguous US)  
**Store:** `dev-store-749237498237499137.myshopify.com`  
**Decision:** Contiguous US only (lower 48 + DC). Flat **$9.95** under $75; **free ground** at $75+. Other destinations: contact for a quote (do not say “we don’t ship”).

## Why this shape

Matches US marine peers (Marine Electronics Depot, iMarine, BOE free/flat rules): simple domestic flats, no free Canada/Mexico. NA free shipping was too expensive (~$15–40 labels to CA/MX) and complex (markets, customs, brokerage).

## Configured in Admin (done)

General delivery profile → zone **Contiguous United States**:

| Rate name | Condition (merchandise subtotal) | Customer pays |
| --- | --- | ---: |
| US Ground | $0.00 – $74.99 | **$9.95** |
| Free US Ground | $75.00+ | **$0** |

Markets: **United States** active. Canada + Mexico markets set to **DRAFT** so checkout stays US-focused.

Policy page `shipping` + `docs/policy-pages/shipping.html`: other destinations → contact for quote (+ hatlabs.fi link).

## Fulfillment (ops)

- Origin: **Florida Warehouse** on General profile; empty Shop location deactivated.
- Buy labels via **Shopify Shipping** (USPS / UPS). Checkout flats ≠ label cost.
- Package presets (Admin UI only): Small board box 8×6×3 @ 0.1 lb (default); Kit box 12×9×4 @ 0.2 lb. See `docs/admin-setup-checklist.md` § E.
- Pack small; adjust $9.95 after a few real FL→zone-8 labels if needed.

## Tax (still open)

1. Florida sales tax registration / CPA advice.
2. Shopify Tax for registered states; product tax categories.
3. Smoke FL vs out-of-state checkout.

## Checkout smoke (after Shopify Payments)

1. Under $75 → **$9.95**; ≥ $75 → free.
2. Contiguous US address only at checkout.
3. One real paid order → label → refund if test-only.

## Storefront UX

| Surface | Copy |
| --- | --- |
| Sitewide bar | Free $75+ / $9.95 under / contiguous US → `/shipping` |
| PDP (below ATC) | Cart-aware free-ship note |
| Cart drawer | Progress + `$9.95` / `Free` |
| Footer | Short reminder + Shipping link |
| `/shipping` | Full policy; other destinations → contact |

Constants: `lib/shipping.ts`.

## Related docs

- `docs/admin-setup-checklist.md` § E Shipping
- `docs/plans/2026-10-08-shop-launch.md` Phase 2
- `docs/shop-best-practices.md` Trust and ops
