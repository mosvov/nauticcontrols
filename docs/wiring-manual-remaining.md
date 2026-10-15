# Remaining Shopify ↔ Next.js wiring (manual)

**Production:** https://admin.shopify.com/store/nautic-controls-bh11vkhs  
**Staging:** https://admin.shopify.com/store/dev-store-749237498237499137  

Catalog, inventory, metafields, markets (CA/MX draft), Headless theme (MAIN, hostname `www.nauticcontrols.com`), Headless channel, and Vercel Production env are already on the live store. Checkout/email links use the Headless theme.

## Still manual in Admin

1. **Packages** (API cannot create): Settings → Shipping and delivery → Packages → Small board box / Kit box per `docs/admin-setup-checklist.md`  
2. Shopify Payments + tax (after Client transfer + paid plan)  
3. Confirm revalidation webhooks on the live store still point at production  

## Revalidation webhooks

`https://www.nauticcontrols.com/api/revalidate?secret=<SHOPIFY_REVALIDATION_SECRET>`

Topics: products/create|update|delete, collections/create|update|delete  
Optional: pages/create|update|delete  

Admin path: Settings → Notifications → Webhooks.

## Cutover rule

- Vercel **Production** → live store tokens only  
- Vercel Preview + local `.env.local` → staging det store until you intentionally switch  
- Do not delete the staging store until a successful paid order on production  

## Client transfer (soft-launch gate)

Do not transfer until soft-launch ready. Partner Client-transfer stores require an **external** recipient email (not the Partner org owner like `mosvov@gmail.com`).

1. Partner Dashboard → store → Transfer to client → external email (bookkeeper / alternate)  
2. Recipient accepts transfer  
3. Choose **Basic** (or higher), not Starter  
4. After paid plan is active, transfer ownership again to `mosvov@gmail.com` if desired  
5. Then enable Shopify Payments / tax; leave Preview on det until you say otherwise  

