import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  compact?: boolean
  elevated?: boolean
}

export function Card({ className, compact = false, elevated = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)]',
        compact ? 'p-4' : 'p-5',
        elevated ? 'shadow-[var(--card-shadow)]' : '',
        className,
      )}
      {...props}
    />
  )
}
