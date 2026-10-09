export type TocItem = {
  id: string;
  title: string;
};

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Inject stable ids on h2 tags and return a table of contents. */
export function enrichPageBody(html: string): {
  html: string;
  toc: TocItem[];
} {
  const toc: TocItem[] = [];
  const used = new Map<string, number>();

  const enriched = html.replace(
    /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi,
    (match, attrs: string = "", inner: string) => {
      const title = stripTags(inner);
      if (!title) return match;

      const existingId = attrs.match(/\sid\s*=\s*["']([^"']+)["']/i)?.[1];
      if (existingId) {
        toc.push({ id: existingId, title });
        return match;
      }

      let id = slugify(title) || "section";
      const count = used.get(id) ?? 0;
      used.set(id, count + 1);
      if (count > 0) id = `${id}-${count + 1}`;

      toc.push({ id, title });
      const attrPart = attrs.trim() ? ` ${attrs.trim()}` : "";
      return `<h2${attrPart} id="${id}">${inner}</h2>`;
    },
  );

  return { html: enriched, toc };
}
