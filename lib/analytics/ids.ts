/** Extract numeric Shopify resource id from a GID or pass through bare ids. */
export function shopifyNumericId(gidOrId: string | undefined): string {
  if (!gidOrId) return "";
  const match = gidOrId.match(/\/(\d+)\s*$/);
  return match?.[1] || gidOrId;
}
