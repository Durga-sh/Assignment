import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger'
type ButtonSize = 'sm' | 'md' | 'icon'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-linear-to-r from-violet-600 to-purple-700 text-white shadow-sm hover:brightness-110',
  secondary:
    'border border-[var(--line)] bg-[var(--bg-main)] text-[var(--text-dim)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
  ghost: 'bg-transparent text-[var(--text-dim)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-main)]',
  success:
    'bg-linear-to-r from-emerald-600 to-green-600 text-white shadow-sm hover:brightness-110',
  danger: 'border border-rose-500/30 bg-rose-50 text-rose-700 hover:bg-rose-100',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'rounded-lg px-2.5 py-1.5 text-[11px] font-semibold',
  md: 'rounded-xl px-3.5 py-2 text-sm font-semibold',
  icon: 'h-9 w-9 rounded-xl p-0',
}

export function Button({
  className,
  type = 'button',
  variant = 'secondary',
  size = 'md',
  leftIcon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 transition disabled:cursor-not-allowed disabled:opacity-60',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
    </button>
  )
}
