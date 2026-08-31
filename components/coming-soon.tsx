import Link from "next/link";

export function ComingSoon() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[420px] w-[600px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-blue-600/15 to-transparent blur-3xl dark:from-cyan-500/15 dark:via-blue-600/20" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/80 px-4 py-1.5 text-xs font-medium text-neutral-800 shadow-xs backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>Online Store Launching Soon</span>
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl dark:text-white">
          Precision Marine Controls &amp; Vessel Automation
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 sm:text-xl dark:text-neutral-300">
          We are preparing our new headless storefront. Soon you will be able to
          explore and order marine control heads, electronic throttles, steering
          automation, and custom vessel telemetry online.
        </p>

        {/* Action / Contact pill */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:info@nauticcontrols.com"
            className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Inquire / Pre-order Contact
          </a>
          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-transparent px-6 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Explore Catalog
          </Link>
        </div>

        {/* Feature Grid Highlights */}
        <div className="mt-16 grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-neutral-200 bg-white/60 p-6 backdrop-blur-xs dark:border-neutral-800 dark:bg-neutral-900/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              ⚡
            </div>
            <h3 className="mt-4 text-base font-semibold text-neutral-900 dark:text-white">
              Electronic Throttle &amp; Shift
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Multi-engine helm controls with responsive detents and
              programmable actuation.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white/60 p-6 backdrop-blur-xs dark:border-neutral-800 dark:bg-neutral-900/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400">
              📡
            </div>
            <h3 className="mt-4 text-base font-semibold text-neutral-900 dark:text-white">
              Vessel Telemetry &amp; Bus
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Seamless NMEA 2000, J1939, and CAN-bus integration for full helm
              diagnostics.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white/60 p-6 backdrop-blur-xs dark:border-neutral-800 dark:bg-neutral-900/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              🛡️
            </div>
            <h3 className="mt-4 text-base font-semibold text-neutral-900 dark:text-white">
              Marine-Grade Durability
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              CNC machined, IP67+ waterproof assemblies built for extreme
              offshore conditions.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white/60 p-6 backdrop-blur-xs dark:border-neutral-800 dark:bg-neutral-900/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              ⚓
            </div>
            <h3 className="mt-4 text-base font-semibold text-neutral-900 dark:text-white">
              Custom Refits &amp; Support
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Tailored engineering packages and technical assistance for yacht
              and commercial builds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
