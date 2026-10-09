import clsx from "clsx";

const Prose = ({ html, className }: { html: string; className?: string }) => {
  return (
    <div
      className={clsx(
        "prose max-w-none text-sm leading-relaxed text-mute prose-headings:mt-6 prose-headings:scroll-mt-20 prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-ink prose-a:text-accent prose-a:underline prose-strong:text-ink prose-ol:list-decimal prose-ol:pl-5 prose-ul:list-disc prose-ul:pl-5",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Prose;
