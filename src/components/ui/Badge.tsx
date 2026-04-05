import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type BadgeVariant = 'default' | 'income' | 'expense' | 'accent' | 'muted' | 'role-admin' | 'role-viewer'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'border border-[var(--line)] bg-[var(--bg-main)] text-[var(--text-main)]',
  income: 'bg-emerald-50 text-emerald-700',
  expense: 'bg-rose-50 text-rose-700',
  accent: 'bg-[var(--accent-light)] text-[var(--accent)]',
  muted: 'border border-[var(--line)] bg-[var(--bg-main)] text-[var(--text-dim)]',
  'role-admin': 'bg-violet-100 text-violet-700',
  'role-viewer': 'bg-sky-100 text-sky-700',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  )
}
