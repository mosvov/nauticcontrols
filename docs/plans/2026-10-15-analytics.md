# Analytics stack (2026-10-15)

Headless Next.js storefront on Vercel + Shopify-hosted checkout.

## Vendors

| Vendor                                | Role                            | Where                                                                  |
| ------------------------------------- | ------------------------------- | ---------------------------------------------------------------------- |
| Vercel Web Analytics + Speed Insights | Traffic / Web Vitals            | `@vercel/analytics`, `@vercel/speed-insights` in `app/layout.tsx`      |
| Shopify storefront analytics          | Channel attribution / Live View | `@shopify/hydrogen-react` `sendShopifyAnalytics` + `useShopifyCookies` |
| Meta Pixel                            | Ads funnel events               | `components/analytics/meta-pixel.tsx` + `lib/analytics/meta.ts`        |
| GA4                                   | Ads / product analytics         | `@next/third-parties/google` + `lib/analytics/ga.ts`                   |

IDs (Vercel env + `.env.local`):

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-KBJ0TPGMS5`
- `NEXT_PUBLIC_META_PIXEL_ID` = `1651238956405337`
- `NEXT_PUBLIC_SHOPIFY_SHOP_ID` = `gid://shopify/Shop/74587996207`

## Storefront events

| Event                                  | Trigger                                      |
| -------------------------------------- | -------------------------------------------- |
| page_view / PageView / PAGE_VIEW       | App Router navigations (`AnalyticsProvider`) |
| view_item / ViewContent / PRODUCT_VIEW | PDP (`ProductViewTracker`)                   |
| add_to_cart / AddToCart / ADD_TO_CART  | Add to cart form                             |
| begin_checkout / InitiateCheckout      | Proceed to Checkout                          |

Purchase is **not** fired from Next.js (checkout is Shopify-hosted).

## Merchant checklist (Shopify Admin)

1. Sales channels → **Facebook & Instagram**: connect Pixel `1651238956405337`
2. Sales channels → **Google & YouTube**: connect GA4 `G-KBJ0TPGMS5`
3. Confirm **Headless** channel serves `www.nauticcontrols.com`
4. Vercel project Analytics is enabled (API toggle done 2026-10-15)

## Verify after deploy

1. Preview/Production with env vars present
2. Home → PDP → add to cart → checkout: network calls to Meta, Google, Monorail, `/_vercel/insights`
3. Test order: Purchase in Meta Events Manager + GA4 (via Shopify channels)
4. Vercel project → Analytics shows page views

## Follow-up (not in v1)

If ad match quality is weak: stash `_fbp` / `_fbc` / `gclid` on cart attributes before checkout, then `orders/create` webhook → Meta CAPI + GA4 Measurement Protocol with shared `event_id` for dedupe.
