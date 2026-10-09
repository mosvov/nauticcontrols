export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-2/3 animate-pulse rounded bg-line" />
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-line" />
        <div className="h-3 w-full animate-pulse rounded bg-line" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-line" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-line" />
        <div className="h-3 w-full animate-pulse rounded bg-line" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-line" />
      </div>
    </div>
  );
}
