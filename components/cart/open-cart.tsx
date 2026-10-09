import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center rounded-[0.35rem] bg-accent text-white shadow-sm transition hover:brightness-105">
      <ShoppingCartIcon
        className={clsx("h-4 stroke-[2]", className)}
      />

      {quantity ? (
        <div className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-semibold text-white ring-2 ring-shelf-bar">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
