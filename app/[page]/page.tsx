import type { Metadata } from "next";
import { Suspense } from "react";

import PolicyRail, { MobilePageToc } from "components/page/policy-rail";
import Prose from "components/prose";
import { enrichPageBody } from "lib/page-toc";
import { getPage, getPages } from "lib/shopify";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const pages = await getPages();
  return pages.map((page) => ({ page: page.handle }));
}

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: "article",
    },
  };
}

export default function Page(props: { params: Promise<{ page: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <div className="min-w-0 flex-1 space-y-4 rounded-[0.35rem] border border-line bg-tile p-6 md:p-8">
            <div className="h-10 w-2/3 animate-pulse rounded bg-line" />
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-line" />
              <div className="h-3 w-full animate-pulse rounded bg-line" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-line" />
            </div>
          </div>
          <div className="h-48 w-full flex-none animate-pulse rounded-[0.35rem] border border-line bg-tile md:w-[240px]" />
        </div>
      }
    >
      <PageContent params={props.params} />
    </Suspense>
  );
}

async function PageContent({ params }: { params: Promise<{ page: string }> }) {
  const { page: handle } = await params;
  const page = await getPage(handle);

  if (!page) return notFound();

  const { html, toc } = enrichPageBody(page.body);

  return (
    <div className="flex flex-col gap-6 md:flex-row md:gap-8">
      <article className="w-full min-w-0 flex-1 rounded-[0.35rem] border border-line bg-tile p-6 md:p-8">
        <h1 className="font-display mb-6 text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {page.title}
        </h1>
        <MobilePageToc toc={toc} />
        <Prose className="mb-8" html={html} />
        <p className="text-sm text-mute italic">
          {`This document was last updated on ${new Intl.DateTimeFormat(
            undefined,
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          ).format(new Date(page.updatedAt))}.`}
        </p>
      </article>
      <PolicyRail currentHandle={handle} toc={toc} />
    </div>
  );
}
