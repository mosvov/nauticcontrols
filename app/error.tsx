"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto my-8 flex max-w-xl flex-col rounded-[0.35rem] border border-line bg-tile p-8 md:p-10">
      <h2 className="font-display text-xl font-bold text-ink">
        Something went wrong
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-mute">
        There was an issue with the storefront. This is often temporary - try
        again.
      </p>
      <button
        className="mt-6 flex w-full items-center justify-center rounded-[0.35rem] bg-accent p-3 text-sm font-bold text-white hover:brightness-105"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
