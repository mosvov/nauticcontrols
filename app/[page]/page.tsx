import type { Metadata } from "next";
import { Suspense } from "react";

import Prose from "components/prose";
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
        <div className="space-y-4">
          <div className="h-10 w-2/3 animate-pulse rounded bg-line" />
          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-line" />
            <div className="h-3 w-full animate-pulse rounded bg-line" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-line" />
          </div>
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

  return (
    <>
      <h1 className="font-display mb-6 text-3xl font-bold tracking-tight text-ink md:text-4xl">
        {page.title}
      </h1>
      <Prose className="mb-8" html={page.body} />
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
    </>
  );
}
