# Compliance and kit go-live gaps

Track items that block truthful FCC claims and kit Activation. Related: [`docs/metafields-schema.md`](metafields-schema.md), Annex §9.1 in [`docs/context-hat-labs-partnership.md`](context-hat-labs-partnership.md).

## FCC / SDoC (before Active on RF products)

- [ ] Hat Labs supplies compliance pack for SH-ESP32 (module FCC IDs, test reports / SDoC materials)
- [ ] Same for HALMET
- [ ] Same for SH-RPi (if applicable)
- [ ] Same for HALPI2 (docs appendix exists; confirm records + US marketing statement)
- [ ] Stable public `compliance_url` per RF SKU, or confirm "available on request" via `/fcc`
- [ ] Signed reseller terms / annex (draft today; FCC responsible-party role assumes signed terms)
- [ ] Brand support email for FCC contact (prefer durable inbox over personal Gmail)

## Kits (before Active)

- [ ] Written kit-bundling consent from Hat Labs (Matti)
- [ ] Nautic install guide for Signal K Gateway Kit → set `install_guide_url`
- [ ] Nautic install guide for Engine Monitoring Kit → set `install_guide_url`
- [ ] Documented firmware path for each kit (SensESP / example FW / Nautic guide)

## Storefront policy pages

- [x] Draft copy in `docs/policy-pages/`
- [x] Published in Shopify Admin with handles `fcc`, `returns`, `shipping`, `about`
- [x] Linked from footer menu (`Next.js Frontend Footer Menu`)

## Notes

- Passive accessories (enclosures, SP13, M12) do not need `docs_url` or `fcc_summary`.
- Until compliance URLs are verified, leave `compliance_url` empty except HALPI2 appendix URL.
- End-customer warranty default: 2-year limited (materials/workmanship). Not legal advice.
