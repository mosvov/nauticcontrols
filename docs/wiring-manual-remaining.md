# Remaining Shopify ↔ Next.js wiring (manual)

Automated setup finished most Admin wiring. Two items need a human click because the Shopify plugin blocks them.

## 1. Headless theme (required for checkout/email links)

Theme zip is in-repo: `docs/shopify-headless-theme.zip`

1. Admin → Online Store → Themes → Add theme → Upload zip  
2. Upload `docs/shopify-headless-theme.zip`  
3. Customize → Theme settings → Storefront → Hostname: `www.nauticcontrols.com`  
4. Publish  

(API `themeCreate` / theme publish are restricted for this app connection.)

## 2. Revalidation webhooks

After production has env vars (already pushed to Vercel - redeploy once), add HTTP webhooks:

Callback (same secret as `SHOPIFY_REVALIDATION_SECRET` in `.env.local` / Vercel):

`https://www.nauticcontrols.com/api/revalidate?secret=464b3bf5-e565-4df1-bfb0-563c38f7d242`

Topics:

- products/create  
- products/update  
- products/delete  
- collections/create  
- collections/update  
- collections/delete  

Admin path: Settings → Notifications → Webhooks.

## Already done via plugin

- Florida Warehouse location (606 Stargaze Lane) - Toronto demo location deactivated  
- Menus: `next-js-frontend-header-menu`, `next-js-frontend-footer-menu`  
- Collections: `hidden-homepage-featured-items`, `hidden-homepage-carousel` (published to Headless)  
- Pages: shipping, returns, about, fcc  
- Vercel env: COMPANY_NAME, SITE_NAME, SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN, SHOPIFY_REVALIDATION_SECRET  

## Note for product-seed chat

Publish every sellable product to the **Dev Store Headless** sales channel, and add kits to the two Hidden collections when ready.
