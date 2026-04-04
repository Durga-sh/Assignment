type EmptyStateProps = {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-[var(--line)] px-4 py-10 text-center">
      <div>
        <h3 className="text-base font-semibold text-[var(--text-main)]">{title}</h3>
        <p className="mt-1 text-sm text-[var(--text-dim)]">{description}</p>
      </div>
    </div>
  )
}
