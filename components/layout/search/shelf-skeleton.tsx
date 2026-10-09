/** Compact shelf placeholder: short enough to avoid footer jump on small collections. */
export function ShelfSkeleton({
  titleWidth = "w-48",
}: {
  titleWidth?: string;
}) {
  return (
    <div className="min-h-[280px]">
      <div
        className={`mb-5 h-8 animate-pulse rounded-[0.35rem] bg-line ${titleWidth}`}
      />
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <li
              key={index}
              className="aspect-[4/3] animate-pulse rounded-[0.35rem] border border-line bg-tile"
            />
          ))}
      </ul>
    </div>
  );
}
