import FilterList from "components/layout/search/filter";
import { sorting } from "lib/constants";
import ChildrenWrapper from "./children-wrapper";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1140px] flex-1 flex-col gap-6 px-4 py-6 text-ink md:flex-row md:gap-8">
      <div className="w-full min-w-0 flex-1">
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </div>
      <aside className="w-full flex-none rounded-[0.35rem] border border-line bg-tile p-5 md:w-[240px] md:max-w-[240px]">
        <FilterList list={sorting} title="Sort by" />
      </aside>
    </div>
  );
}
