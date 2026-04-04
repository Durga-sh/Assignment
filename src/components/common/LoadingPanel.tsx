export function LoadingPanel() {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-6">
      <div className="h-4 w-36 animate-pulse rounded bg-[var(--bg-soft)]" />
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-xl bg-[var(--bg-soft)]" />
        ))}
      </div>
    </div>
  )
}
