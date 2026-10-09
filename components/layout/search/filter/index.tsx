import { SortFilterItem } from "lib/constants";
import { Suspense } from "react";
import FilterItemDropdown from "./dropdown";
import { FilterItem } from "./item";

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { title: string; path: string };

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <>
      {list.map((item: ListItem, i) => (
        <FilterItem key={i} item={item} />
      ))}
    </>
  );
}

export default function FilterList({
  list,
  title,
}: {
  list: ListItem[];
  title?: string;
}) {
  return (
    <>
      <nav>
        {title ? (
          <h3 className="mb-1 hidden text-xs tracking-[0.14em] text-mute uppercase md:block">
            {title}
          </h3>
        ) : null}
        <ul className="hidden md:block">
          <Suspense
            fallback={
              <li className="mt-2 h-4 w-20 animate-pulse rounded bg-line" />
            }
          >
            <FilterItemList list={list} />
          </Suspense>
        </ul>
        <ul className="md:hidden">
          <Suspense
            fallback={
              <li className="h-10 w-full animate-pulse rounded-[0.35rem] bg-line" />
            }
          >
            <FilterItemDropdown list={list} />
          </Suspense>
        </ul>
      </nav>
    </>
  );
}
