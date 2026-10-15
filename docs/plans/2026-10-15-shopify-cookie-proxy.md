# Fix Shopify analytics cookie bootstrap

**Date:** 2026-10-15  
**Status:** Implemented on `feat/shopify-cookie-proxy`  
**Related:** [2026-10-15-analytics.md](./2026-10-15-analytics.md)

## Problem

`useShopifyCookies({ fetchTrackingValues: true })` needs a same-origin Storefront API call so Shopify can set first-party HTTP-only analytics cookies. Without `/api/unstable/graphql.json`, the browser got 404s and visitor tokens stayed empty (Monorail still fired).

## Fix

1. Same-origin proxy at `app/api/unstable/graphql.json` → Shopify `/api/unstable/graphql.json`, forwarding `Set-Cookie` + `Server-Timing`
2. Absolute `https://` `checkoutDomain` fallback for the hydrogen-react retry path
3. Defer Shopify page views until `cookiesReady`; Meta/GA still fire immediately

## Verify

1. `POST /api/unstable/graphql.json` → 200
2. `getTrackingValues()` non-empty `uniqueToken` / `visitToken`
3. No relative `…/product/….myshopify.com/api/...` requests
4. Monorail `produce_batch` still 200
