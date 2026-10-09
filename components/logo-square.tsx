import clsx from "clsx";
import LogoIcon from "./icons/logo";

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center border border-line bg-tile",
        {
          "h-[40px] w-[40px] rounded-[0.35rem]": !size,
          "h-[30px] w-[30px] rounded-[0.35rem]": size === "sm",
        },
      )}
    >
      <LogoIcon
        className={clsx("fill-ink", {
          "h-[16px] w-[16px]": !size,
          "h-[10px] w-[10px]": size === "sm",
        })}
      />
    </div>
  );
}
