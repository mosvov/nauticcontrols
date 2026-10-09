"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Form from "next/form";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form action="/search" className="relative w-full">
      <input
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder="Search products..."
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="w-full rounded-[0.35rem] border-0 bg-white/70 px-3 py-2 pr-9 text-sm text-ink shadow-[inset_0_0_0_1px_rgba(26,35,48,0.08)] placeholder:text-mute outline-none transition focus:bg-white focus:shadow-[inset_0_0_0_1.5px_rgba(47,111,237,0.45)]"
      />
      <div className="pointer-events-none absolute top-0 right-0 mr-3 flex h-full items-center text-mute">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="relative w-full">
      <input
        placeholder="Search products..."
        className="w-full rounded-[0.35rem] border-0 bg-white/70 px-3 py-2 pr-9 text-sm text-ink shadow-[inset_0_0_0_1px_rgba(26,35,48,0.08)] placeholder:text-mute"
      />
      <div className="pointer-events-none absolute top-0 right-0 mr-3 flex h-full items-center text-mute">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
