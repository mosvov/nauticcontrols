import Link from "next/link";

export function ComingSoon() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[420px] w-[600px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-blue-600/15 to-transparent blur-3xl dark:from-cyan-500/15 dark:via-blue-600/20" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/80 px-4 py-1.5 text-xs font-medium text-neutral-800 shadow-xs backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>US stock landing soon</span>
        </div>

        <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-cyan-700 uppercase dark:text-cyan-300">
          Nautic Controls
        </p>

        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl dark:text-white">
          The US home for Signal&nbsp;K hardware
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 sm:text-xl dark:text-neutral-300">
          Domestic Florida stock of Hat Labs boards and turnkey installation
          kits. Gateway and engine-monitoring kits with docs, pre-flashed
          firmware intent, and 2-to-4-day US shipping - no surprise import fees.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:info@nauticcontrols.com?subject=Nautic%20Controls%20waitlist"
            className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Join the waitlist
          </a>
          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-transparent px-6 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Browse catalog
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-neutral-200 bg-white/60 p-6 backdrop-blur-xs dark:border-neutral-800 dark:bg-neutral-900/60">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
              Gateway kit
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              SH-ESP32 + enclosure + NMEA 2000 M12 lead. Target shelf{" "}
              <span className="font-medium text-neutral-900 dark:text-white">
                $89.99
              </span>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white/60 p-6 backdrop-blur-xs dark:border-neutral-800 dark:bg-neutral-900/60">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
              Engine kit
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              HALMET + enclosure + SP13 power. Analog gauges to live Signal K.
              Target shelf{" "}
              <span className="font-medium text-neutral-900 dark:text-white">
                $169.99
              </span>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white/60 p-6 backdrop-blur-xs dark:border-neutral-800 dark:bg-neutral-900/60">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
              US stock &amp; support
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Ship from Florida in 2-4 days. First-line wiring and firmware help
              from Nautic Controls.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white/60 p-6 backdrop-blur-xs dark:border-neutral-800 dark:bg-neutral-900/60">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
              Honest DIY kits
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Open Hat Labs hardware with install guides - not Actisense
              plug-and-play clones. We say what it does and what it does not.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
