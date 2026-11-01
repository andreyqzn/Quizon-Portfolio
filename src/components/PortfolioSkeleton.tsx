import { cn } from '../lib/cn'

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-subtle',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-[skeleton-shimmer_1.4s_ease_infinite]',
        'after:bg-gradient-to-r after:from-transparent after:via-primary/5 after:to-transparent',
        className,
      )}
    />
  )
}

export function PortfolioSkeleton() {
  return (
    <div className="animate-in fade-in duration-300" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading portfolio…</span>

      <header className="relative">
        <div className="grid items-end gap-10 md:grid-cols-12 md:gap-12">
          <div className="order-2 space-y-5 md:order-1 md:col-span-7">
            <Bone className="h-4 w-40" />
            <Bone className="h-16 w-full max-w-md md:h-24" />
            <Bone className="h-5 w-64" />
            <div className="flex gap-3 pt-2">
              <Bone className="h-11 w-28 rounded-full" />
              <Bone className="h-11 w-24 rounded-full" />
            </div>
          </div>
          <div className="order-1 md:order-2 md:col-span-5">
            <Bone className="h-[58vw] w-full md:aspect-[4/5] md:h-auto" />
          </div>
        </div>
      </header>

      <main className="mt-20 space-y-0 md:mt-28">
        {Array.from({ length: 5 }).map((_, index) => (
          <section key={index} className="border-t border-border py-16 md:py-20">
            <Bone className="mb-8 h-8 w-40" />
            <div className="max-w-2xl space-y-3">
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-[92%]" />
              <Bone className="h-4 w-[78%]" />
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
