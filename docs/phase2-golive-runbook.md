# Phase 2 — Go-live runbook (after stock lands)

Execute in order. Do not announce sales until step 7 passes.

## 1. Receive inventory

- [ ] Unbox at Florida Warehouse
- [ ] Count vs `docs/pilot-po-revised-2026-09-30.csv` within 10 business days
- [ ] Photo any damage; notify Hat Labs if needed
- [ ] Assign lot / Hat Labs order ref for warranty tracking

## 2. Upgrade Shopify plan

- [ ] Settings → Plan → choose **Basic** or higher (not Starter)
- [ ] Billing on Nautic Controls / card on file
- [ ] Confirm Headless channel still installed after upgrade

## 3. Payments & tax

- [ ] Enable Shopify Payments (or approved gateway) for USD
- [ ] Business legal name: Nautic Controls
- [ ] Florida sales tax registration if required; configure Shopify tax

## 4. Inventory

- [ ] Settings → Locations: Florida warehouse active; deactivate unused demo locations
- [ ] Set on-hand qty for kits and boards (kits as finished SKUs, not BOM explode)
- [ ] Publish sellable products to **Headless** channel
- [ ] Leave draft any SKU without firmware path + install guide

## 5. Shipping & policies

- [ ] Domestic US rates (2–4 day promise must be real)
- [ ] Pages live: Shipping, Returns & Warranty, About, FCC

## 6. Storefront ungating

- [ ] Vercel env populated (same as `.env.local`)
- [ ] Webhooks pointing at production `/api/revalidate`
- [ ] Remove or soften coming-soon once kits are Active with stock
- [ ] Smoke: real card test order $1 or low-SKU, then refund if needed

## 7. Soft launch

- [ ] Email waitlist
- [ ] One community announcement per rules in `plan-90-day-marketing.md`
- [ ] Staff support inbox for first two weeks
