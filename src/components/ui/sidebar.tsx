import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { IconMenu2, IconX } from '@tabler/icons-react'
import React, { useState } from 'react'
import { type Links, SidebarContext, useSidebar } from './sidebar-context'

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  const [openState, setOpenState] = useState(false)
  const open = openProp !== undefined ? openProp : openState
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  )
}

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<'div'>)} />
    </>
  )
}

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar()
  return (
    <motion.div
      className={cn(
        'hidden h-full flex-col bg-(--bg-surface) border-r border-(--line) px-3 py-4 md:flex shrink-0',
        className,
      )}
      animate={{ width: animate ? (open ? '240px' : '62px') : '240px' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) => {
  const { open, setOpen } = useSidebar()
  return (
    <div
      className={cn(
        'flex h-12 flex-row items-center justify-between border-b border-(--line) bg-(--bg-surface) px-4 md:hidden w-full',
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-(--accent)" />
        <span className="text-sm font-bold text-(--text-main)">Zorvyn</span>
      </div>
      <button
        className="z-20 text-(--text-main)"
        onClick={() => setOpen(!open)}
        aria-label="Open menu"
      >
        <IconMenu2 size={22} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className={cn(
              'fixed inset-0 z-100 flex h-full w-full flex-col justify-between bg-(--bg-surface) p-8',
              className,
            )}
          >
            <button
              className="absolute right-8 top-8 z-50 text-(--text-main)"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <IconX size={22} />
            </button>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links
  className?: string
  [key: string]: unknown
}) => {
  const { open, animate } = useSidebar()
  return (
    <a
      href={link.href}
      onClick={(e) => {
        if (link.onClick) {
          e.preventDefault()
          link.onClick()
        }
      }}
      className={cn(
        'group/sidebar flex items-center justify-start gap-3 rounded-xl px-2 py-2.5 transition-all duration-150',
        link.active
          ? 'bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-(--accent)'
          : 'text-(--text-dim) hover:bg-(--bg-main) hover:text-(--text-main)',
        className,
      )}
      {...props}
    >
      <span className={cn('shrink-0', link.active ? 'text-(--accent)' : 'text-(--text-dim) group-hover/sidebar:text-(--text-main)')}>
        {link.icon}
      </span>
      <motion.span
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="truncate text-sm font-medium whitespace-pre"
      >
        {link.label}
      </motion.span>
    </a>
  )
}
