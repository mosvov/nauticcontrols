import clsx from "clsx";
import { Suspense } from "react";

import { getCollections } from "lib/shopify";
import FilterList from "./filter";

async function CollectionList() {
  const collections = await getCollections();
  return <FilterList list={collections} title="Collections" />;
}

const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded-[0.25rem]";

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, "bg-ink/20")} />
          <div className={clsx(skeleton, "bg-ink/20")} />
          <div className={clsx(skeleton, "bg-line")} />
          <div className={clsx(skeleton, "bg-line")} />
          <div className={clsx(skeleton, "bg-line")} />
          <div className={clsx(skeleton, "bg-line")} />
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
