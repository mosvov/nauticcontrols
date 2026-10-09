"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageIndex = searchParams.has("image")
    ? parseInt(searchParams.get("image")!)
    : 0;

  const updateImage = (index: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("image", index);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <form>
      <div className="relative aspect-square overflow-hidden rounded-[0.35rem] border border-line bg-tile">
        {images[imageIndex] ? (
          <Image
            className="object-contain p-6 md:p-10"
            fill
            sizes="(min-width: 900px) 55vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            priority={true}
          />
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="mt-2.5 grid grid-cols-4 gap-2">
          {images.map((image, index) => {
            const isActive = index === imageIndex;

            return (
              <li key={image.src}>
                <button
                  formAction={() => updateImage(index.toString())}
                  aria-label="Select product image"
                  className={clsx(
                    "relative aspect-square w-full overflow-hidden rounded-[0.25rem] border bg-tile",
                    isActive ? "border-accent" : "border-line",
                  )}
                >
                  <Image
                    alt={image.altText}
                    src={image.src}
                    fill
                    className="object-contain p-1"
                    sizes="80px"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}
