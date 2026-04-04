import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import type { ReactNode } from 'react'
import { useFinance } from '../../context/FinanceContext'

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'insights', label: 'Insights' },
]

type AppLayoutProps = {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { role, setRole, theme, setTheme } = useFinance()

  return (
    <motion.main
      className="mx-auto min-h-screen max-w-7xl px-4 py-5 md:px-6 md:py-8"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, type: 'spring', bounce: 0.15 }}
    >
      <motion.header
        className="sticky top-3 z-20 mb-6 rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-surface)_85%,transparent)] p-4 shadow-lg backdrop-blur"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Zorvyn Finance Desk</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-main)] md:text-3xl">Financial Command Center</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <nav className="rounded-xl border border-[var(--line)] bg-[var(--bg-main)] p-1">
              {navItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  className="inline-block rounded-lg px-3 py-2 text-sm text-[var(--text-dim)] transition hover:bg-[var(--accent)] hover:font-semibold hover:text-[#031824]"
                  whileHover={{ y: -1, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <select
              value={role}
              onChange={(event) => setRole(event.target.value as 'viewer' | 'admin')}
              className="rounded-xl border border-[var(--line)] bg-[var(--bg-main)] px-3 py-2 text-sm text-[var(--text-main)]"
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>

            <motion.button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg-main)] px-3 py-2 text-sm text-[var(--text-main)] transition hover:border-[var(--accent)]"
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {children}
      </motion.section>
    </motion.main>
  )
}
