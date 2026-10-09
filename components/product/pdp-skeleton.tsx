/** Matches PDP grid without oversized empty space under the fold. */
export function PdpSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1140px] flex-1 px-4 pt-4 pb-10">
      <div className="mb-4 h-4 w-28 animate-pulse rounded bg-line" />
      <div className="grid gap-5 md:grid-cols-[1.35fr_0.75fr] md:items-start">
        <div className="aspect-square max-h-[min(70vh,560px)] w-full animate-pulse rounded-[0.35rem] border border-line bg-tile md:max-h-none" />
        <BuyPanelSkeleton />
      </div>
    </div>
  );
}

export function BuyPanelSkeleton() {
  return (
    <div className="rounded-[0.35rem] border border-line bg-tile p-5 md:sticky md:top-4 md:p-6">
      <div className="h-8 w-4/5 animate-pulse rounded bg-line" />
      <div className="mt-4 h-5 w-24 animate-pulse rounded bg-line" />
      <div className="mt-5 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-line" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-line" />
      </div>
      <div className="mt-5 h-12 w-full animate-pulse rounded-[0.35rem] bg-line" />
    </div>
  );
}
