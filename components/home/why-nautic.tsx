import Link from "next/link";
import type { ReactNode } from "react";

const linkClass =
  "text-ink underline decoration-line underline-offset-4 hover:decoration-accent";

const faqs: { question: string; answer: ReactNode }[] = [
  {
    question: "Where do I start?",
    answer: (
      <>
        Use{" "}
        <Link href="#shop-by-type" className={linkClass}>
          Shop by type
        </Link>{" "}
        above: kits for a bundled install, boards if you already have an
        enclosure, computers for a Signal K host, or NMEA 2000 for backbone
        parts.
      </>
    ),
  },
  {
    question: "What is Signal K?",
    answer: (
      <>
        An open standard for sharing boat data (instruments, sensors, apps)
        without proprietary lock-in. It works alongside NMEA 2000. Much of our
        catalog is meant to feed or run a Signal K setup.{" "}
        <a
          href="https://signalk.org"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          signalk.org
        </a>
      </>
    ),
  },
  {
    question: "Returns and warranty?",
    answer: (
      <>
        Unused items in original packaging can usually be returned within 30
        days of delivery. Full return and warranty terms are on{" "}
        <Link href="/returns" className={linkClass}>
          Returns &amp; Warranty
        </Link>
        .
      </>
    ),
  },
];

/** Homepage FAQ under the featured shelf. Accordion keeps the page compact. */
export function WhyNautic() {
  return (
    <section aria-labelledby="home-faq-heading">
      <h2
        id="home-faq-heading"
        className="font-display text-2xl font-bold tracking-tight text-ink"
      >
        Common questions
      </h2>
      <ul className="mt-4 border-t border-line">
        {faqs.map((faq) => (
          <li key={faq.question} className="border-b border-line">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[0.2rem] py-3.5 text-[0.95rem] font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden
                  className="text-mute transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-mute">
                {faq.answer}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
