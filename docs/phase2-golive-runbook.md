# Phase 2 — Go-live runbook (after stock lands)

Execute in order. Do not announce sales until step 7 passes.

**Production store:** https://admin.shopify.com/store/nautic-controls-bh11vkhs  
**Staging store (keep):** https://admin.shopify.com/store/dev-store-749237498237499137

Dev stores cannot be converted to production. Live work happens on `nautic-controls-bh11vkhs` only. See `docs/admin-setup-checklist.md` for initial Admin wiring.

## 1. Receive inventory

- [x] Unbox at Florida Warehouse
- [x] Count vs `docs/pilot-po-revised-2026-09-30.csv` within 10 business days
- [x] Photo any damage; notify Hat Labs if needed
- [x] Assign lot / Hat Labs order ref for warranty tracking

## 2. Confirm live store plan (Client transfer)

- [ ] Soft-launch ready (catalog/inventory/theme already on `nautic-controls-bh11vkhs`)
- [ ] Client transfer to an **external** email (not Partner owner); accept invite
- [ ] Production store on **Basic** or higher (not Starter); billing on file
- [ ] Optional second ownership transfer to `mosvov@gmail.com`
- [ ] Headless channel installed; Storefront tokens in Vercel **Production** (done)

## 3. Payments & tax

- [ ] Enable Shopify Payments (or approved gateway) for USD
- [ ] Business legal name: Nautic Controls / RigSense as registered
- [ ] Florida sales tax registration if required; configure Shopify tax

## 4. Inventory

- [ ] Settings → Locations: Florida warehouse active; deactivate unused demo locations
- [ ] Set on-hand qty for kits and boards (kits as finished SKUs, not BOM explode)
- [ ] Publish sellable products to **Headless** channel
- [ ] Leave draft any SKU without firmware path + install guide

## 5. Shipping & policies

- [ ] Domestic US rates live ($9.95 under $75, free $75+)
- [ ] Pages live: Shipping, Returns & Warranty, About, FCC

## 6. Storefront ungating

- [ ] Vercel **Production** env points at `nautic-controls-bh11vkhs.myshopify.com`
- [ ] Webhooks on the **live** store → production `/api/revalidate`
- [ ] Remove or soften coming-soon once kits are Active with stock
- [ ] Smoke: real card test order $1 or low-SKU, then refund if needed

## 7. Soft launch

- [ ] Email waitlist
- [ ] One community announcement per rules in `plan-90-day-marketing.md`
- [ ] Staff support inbox for first two weeks
