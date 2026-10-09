import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-[1140px] flex-col items-start justify-center px-4 py-16">
      <p className="text-xs tracking-[0.16em] text-mute uppercase">404</p>
      <h1 className="font-display mt-2 text-4xl font-bold tracking-tight text-ink">
        Page not on the shelf
      </h1>
      <p className="mt-3 max-w-md text-mute">
        That route does not exist, or the product was removed. Head back to the
        catalog and keep browsing.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/search"
          className="inline-flex min-h-11 items-center rounded-[0.35rem] bg-accent px-5 text-sm font-bold text-white hover:brightness-105"
        >
          Browse catalog
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-[0.35rem] border border-line bg-tile px-5 text-sm font-semibold text-ink"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
