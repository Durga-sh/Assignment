import {
  IconChartBar,
  IconCreditCard,
  IconLayoutDashboard,
  IconMoon,
  IconSun,
} from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Check, ChevronDown, Eye, Plus, ShieldCheck } from 'lucide-react'
import viteLogo from '../../assets/vite.svg'
import { useEffect, useRef, useState } from 'react'
import { useFinance } from '../../context/FinanceContext'
import { can, ROLE_META } from '../../lib/permissions'
import { InsightsPage } from '../../pages/InsightsPage'
import { OverviewPage } from '../../pages/OverviewPage'
import { TransactionsPage } from '../../pages/TransactionsPage'
import type { Role } from '../../types/finance'

type Page = 'overview' | 'transactions' | 'insights'

const NAV = [
  { label: 'Overview', icon: <IconLayoutDashboard size={18} />, page: 'overview' as Page },
  { label: 'Transactions', icon: <IconCreditCard size={18} />, page: 'transactions' as Page },
  { label: 'Insights', icon: <IconChartBar size={18} />, page: 'insights' as Page },
]

// Role Switcher Dropdown
function RoleSwitcher({ role, onSelect }: { role: Role; onSelect: (r: Role) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const meta = ROLE_META[role]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-[var(--bg-soft)]"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm ${meta.avatarBg}`}>
          {role === 'admin' ? 'A' : 'V'}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-[var(--text-main)] leading-tight">{meta.label}</p>
          <p className="text-xs text-[var(--text-dim)]">{role === 'admin' ? 'Administrator' : 'Read-Only'}</p>
        </div>
        <ChevronDown
          size={14}
          className={`hidden sm:block text-[var(--text-dim)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] shadow-xl"
          >
            <div className="border-b border-[var(--line)] px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-dim)]">Switch Role</p>
              <p className="mt-0.5 text-xs text-[var(--text-dim)]">Select the access level for this session</p>
            </div>

            <div className="flex flex-col gap-2 p-3">
              {(['viewer', 'admin'] as Role[]).map((r) => {
                const m = ROLE_META[r]
                const active = role === r
                return (
                  <button
                    key={r}
                    onClick={() => { onSelect(r); setOpen(false) }}
                    className={`group relative flex w-full flex-col gap-2 rounded-xl border p-3.5 text-left transition-all duration-150 ${
                      active
                        ? 'border-[var(--accent)] bg-[var(--accent-light)]'
                        : 'border-[var(--line)] hover:border-[var(--accent)]/50 hover:bg-[var(--bg-soft)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${m.badgeBg} ${m.badgeText}`}>
                          {r === 'admin' ? <ShieldCheck size={15} /> : <Eye size={15} />}
                        </span>
                        <div>
                          <span className="text-sm font-bold text-[var(--text-main)]">{m.label}</span>
                          <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${m.badgeBg} ${m.badgeText}`}>
                            {r === 'admin' ? 'Full Access' : 'Read Only'}
                          </span>
                        </div>
                      </div>
                      {active && <Check size={14} className="text-[var(--accent)]" />}
                    </div>

                    <p className="text-xs text-[var(--text-dim)]">{m.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {m.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="rounded-full border border-[var(--line)] bg-[var(--bg-main)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-dim)]"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="border-t border-[var(--line)] px-4 py-2.5">
              <p className="text-[10px] text-[var(--text-dim)]">
                Role changes apply immediately and are persisted locally.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// App Layout
export function AppLayout() {
  const { role, setRole, theme, setTheme } = useFinance()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState<Page>('overview')
  const canAdd = can(role, 'create:transaction')
  const meta = ROLE_META[role]

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-main)]">
      {/* Sidebar */}
      <motion.aside
        className="relative z-20 flex h-full shrink-0 flex-col border-r border-[var(--line)] bg-[var(--bg-surface)] overflow-hidden"
        animate={{ width: sidebarOpen ? 220 : 64 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-main)] border border-[var(--line)] shadow-sm">
            <img src={viteLogo} alt="Logo" className="h-5 w-5 object-contain" />
          </div>
          <motion.span
            animate={{ opacity: sidebarOpen ? 1 : 0, x: sidebarOpen ? 0 : -6 }}
            transition={{ duration: 0.15 }}
            className="whitespace-nowrap text-sm font-extrabold tracking-tight text-[var(--text-main)]"
          >
            Finance
          </motion.span>
        </div>

        {/* Quick-add button - Admin only */}
        {canAdd && (
          <div className="px-3 pb-3 pt-4">
            <motion.button
              onClick={() => setActivePage('transactions')}
              whileTap={{ scale: 0.97 }}
              className="flex w-full items-center gap-2.5 overflow-hidden rounded-xl bg-linear-to-r from-violet-600 to-purple-700 px-3 py-2.5 text-white shadow-sm hover:brightness-110"
            >
              <Plus size={16} className="shrink-0" />
              <motion.span
                animate={{ opacity: sidebarOpen ? 1 : 0 }}
                className="overflow-hidden whitespace-nowrap text-sm font-semibold"
              >
                Add Transaction
              </motion.span>
            </motion.button>
          </div>
        )}

        {/* Nav links */}
        <nav className={`flex flex-1 flex-col gap-0.5 overflow-x-hidden overflow-y-auto px-2 ${canAdd ? '' : 'pt-4'}`}>
          {NAV.map((link) => {
            const active = activePage === link.page
            return (
              <button
                key={link.label}
                onClick={() => setActivePage(link.page)}
                className={`flex items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors duration-150 ${
                  active
                    ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                    : 'text-[var(--text-dim)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-main)]'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    active ? 'bg-[var(--accent)] text-white' : ''
                  }`}
                >
                  {link.icon}
                </span>
                <motion.span
                  animate={{ opacity: sidebarOpen ? 1 : 0 }}
                  className="whitespace-nowrap text-sm font-semibold"
                >
                  {link.label}
                </motion.span>
              </button>
            )
          })}
        </nav>

        {/* Bottom - role indicator + theme toggle */}
        <div className="flex flex-col gap-0.5 border-t border-[var(--line)] p-2">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${meta.badgeBg} ${meta.badgeText}`}>
              {role === 'admin' ? <ShieldCheck size={15} /> : <Eye size={15} />}
            </span>
            <motion.div
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className="flex min-w-0 flex-col"
            >
              <span className={`text-xs font-bold ${meta.color}`}>{meta.label}</span>
              <span className="text-[10px] text-[var(--text-dim)]">
                {role === 'admin' ? 'Full access' : 'Read-only'}
              </span>
            </motion.div>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-[var(--text-dim)] transition-colors hover:bg-[var(--bg-soft)] hover:text-[var(--text-main)]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
              {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </span>
            <motion.span
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className="whitespace-nowrap text-sm font-semibold"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </motion.span>
          </button>
        </div>
      </motion.aside>

      {/* Right column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--line)] bg-[var(--bg-surface)] px-6">
          <div>
            <p className="text-sm font-bold text-[var(--text-main)] capitalize">{activePage}</p>
            <p className="text-xs text-[var(--text-dim)]">
              {activePage === 'overview' && 'Financial summary at a glance'}
              {activePage === 'transactions' && 'Browse and manage records'}
              {activePage === 'insights' && 'Patterns and observations'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`hidden md:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.badgeBg} ${meta.badgeText}`}
            >
              {role === 'admin' ? <ShieldCheck size={12} /> : <Eye size={12} />}
              {meta.label}
            </span>

            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-main)] text-[var(--text-dim)] transition-colors hover:bg-[var(--bg-soft)]">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--accent)]" />
            </button>

            <RoleSwitcher role={role} onSelect={setRole} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex flex-1 flex-col overflow-hidden bg-[var(--bg-main)] p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              className="flex h-full flex-col"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {activePage === 'overview' && <OverviewPage />}
              {activePage === 'transactions' && (
                <div className="flex-1 overflow-y-auto">
                  <TransactionsPage />
                </div>
              )}
              {activePage === 'insights' && (
                <div className="flex-1 overflow-y-auto">
                  <InsightsPage />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}