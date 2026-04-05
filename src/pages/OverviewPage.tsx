import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Banknote, MoreHorizontal, PiggyBank, TrendingUp } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { LoadingPanel } from '../components/common/LoadingPanel'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency } from '../utils/format'

const PIE_COLORS = ['#7c3aed', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#6366f1']

export function OverviewPage() {
  const { loading, summary, trendData, spendingBreakdown, transactions } = useFinance()

  if (loading) return <LoadingPanel />

  const savingsRate =
    summary.totalIncome > 0
      ? ((summary.totalIncome - summary.totalExpenses) / summary.totalIncome) * 100
      : 0

  const monthlyData = Array.from(
    transactions.reduce((acc, txn) => {
      const key = txn.date.slice(0, 7)
      const cur = acc.get(key) ?? { month: key, income: 0, expenses: 0 }
      if (txn.type === 'income') cur.income += txn.amount
      else cur.expenses += txn.amount
      acc.set(key, cur)
      return acc
    }, new Map<string, { month: string; income: number; expenses: number }>()).values(),
  )
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((row) => ({
      ...row,
      label: new Date(`${row.month}-01`).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    }))

  const chartTrend = trendData.map((d) => ({
    ...d,
    label: new Date(`${d.month}-01`).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
  }))

  const pieTotal = spendingBreakdown.reduce((s, i) => s + i.amount, 0)

  const kpi = [
    {
      label: 'Net Balance',
      value: formatCurrency(summary.totalBalance),
      icon: <Banknote size={18} />,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      dot: 'bg-violet-500',
    },
    {
      label: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      icon: <ArrowUpRight size={18} />,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      dot: 'bg-emerald-500',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      icon: <ArrowDownRight size={18} />,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-500',
      dot: 'bg-orange-500',
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      icon: <PiggyBank size={18} />,
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-500',
      dot: 'bg-pink-500',
    },
  ]

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">

      {/* ── Row 1: KPI Cards ───────────────────────────────────── */}
      <div className="grid shrink-0 grid-cols-2 gap-4 lg:grid-cols-4">
        {kpi.map((card, i) => (
          <motion.article
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5 shadow-[var(--card-shadow)]"
          >
            <div>
              <p className="mb-1 text-xs font-semibold text-[var(--text-dim)]">{card.label}</p>
              <p className="text-xl font-extrabold tracking-tight text-[var(--text-main)]">{card.value}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${card.dot}`} />
                <span className="text-[10px] text-[var(--text-dim)]">All time</span>
              </div>
            </div>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor}`}>
              {card.icon}
            </div>
          </motion.article>
        ))}
      </div>

      {/* ── Row 2: Income vs Expenses Bar + Spending Donut ────── */}
      <div className="grid shrink-0 gap-4 lg:grid-cols-5">

        {/* Income vs Expenses grouped bar (3/5) */}
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="col-span-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5 shadow-[var(--card-shadow)]"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-main)]">Income vs Expenses</h2>
              <p className="text-xs text-[var(--text-dim)]">Monthly comparison</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                <span className="h-2.5 w-2.5 rounded-sm bg-violet-500" />
                Income
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                <span className="h-2.5 w-2.5 rounded-sm bg-cyan-400" />
                Expenses
              </span>
              <button className="text-[var(--text-dim)] hover:text-[var(--text-main)]">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
          <div className="h-48">
            {monthlyData.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-[var(--text-dim)]">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  barGap={2}
                  barCategoryGap="28%"
                  margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--line)" strokeDasharray="3 6" vertical={false} opacity={0.6} />
                  <XAxis dataKey="label" stroke="var(--text-dim)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    stroke="var(--text-dim)"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, background: 'var(--bg-surface)', borderColor: 'var(--line)', fontSize: 12 }}
                    cursor={{ fill: 'var(--bg-soft)' }}
                    formatter={(v, n) => [formatCurrency(Number(v)), n === 'income' ? 'Income' : 'Expenses']}
                  />
                  <Bar dataKey="income" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.article>

        {/* Spending Donut (2/5) */}
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="col-span-2 rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5 shadow-[var(--card-shadow)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-main)]">Spending by Category</h2>
              <p className="text-xs text-[var(--text-dim)]">Expense breakdown</p>
            </div>
            <button className="text-[var(--text-dim)] hover:text-[var(--text-main)]">
              <MoreHorizontal size={16} />
            </button>
          </div>
          {spendingBreakdown.length === 0 ? (
            <div className="grid h-40 place-items-center text-sm text-[var(--text-dim)]">No expense data</div>
          ) : (
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingBreakdown}
                      dataKey="amount"
                      nameKey="category"
                      innerRadius={40}
                      outerRadius={68}
                      paddingAngle={2}
                      stroke="var(--bg-surface)"
                      strokeWidth={2}
                    >
                      {spendingBreakdown.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 10, background: 'var(--bg-surface)', borderColor: 'var(--line)', fontSize: 12 }}
                      formatter={(v) => formatCurrency(Number(v))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-1.5">
                {spendingBreakdown.slice(0, 5).map((item, i) => (
                  <li key={item.category} className="flex items-center justify-between gap-1.5 text-[11px]">
                    <span className="flex min-w-0 items-center gap-1.5 text-[var(--text-dim)]">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="truncate">{item.category}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-[var(--text-main)]">
                      {pieTotal > 0 ? ((item.amount / pieTotal) * 100).toFixed(0) : 0}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.article>
      </div>

      {/* ── Row 3: Balance Trend + Category Table + Violet Card ─ */}
      <div className="grid gap-4 pb-1 lg:grid-cols-5">

        {/* Balance Trend area chart (2/5) */}
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="col-span-2 rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5 shadow-[var(--card-shadow)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-main)]">Balance Trend</h2>
              <p className="text-xs text-[var(--text-dim)]">Running monthly balance</p>
            </div>
            <button className="text-[var(--text-dim)] hover:text-[var(--text-main)]">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="h-40">
            {chartTrend.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-[var(--text-dim)]">No balance data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--line)" strokeDasharray="3 5" vertical={false} opacity={0.5} />
                  <XAxis
                    dataKey="label"
                    stroke="var(--text-dim)"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                    minTickGap={24}
                  />
                  <YAxis
                    stroke="var(--text-dim)"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                    tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, background: 'var(--bg-surface)', borderColor: 'var(--line)', fontSize: 12 }}
                    formatter={(v) => formatCurrency(Number(v))}
                  />
                  <Area type="natural" dataKey="balance" stroke="#f97316" fill="url(#balGrad)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.article>

        {/* Top spending categories table (2/5) */}
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="col-span-2 rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5 shadow-[var(--card-shadow)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text-main)]">Spending by Division</h2>
            <button className="text-[var(--text-dim)] hover:text-[var(--text-main)]">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="flex justify-between border-b border-[var(--line)] pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            <span>Category</span>
            <span>Amount</span>
          </div>
          <ul className="mt-1.5 space-y-0.5">
            {spendingBreakdown.slice(0, 6).map((item, i) => (
              <motion.li
                key={item.category}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center gap-2 rounded-lg px-1 py-1.5 transition-colors hover:bg-[var(--bg-soft)]"
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${PIE_COLORS[i % PIE_COLORS.length]}20` }}
                >
                  <TrendingUp size={12} style={{ color: PIE_COLORS[i % PIE_COLORS.length] }} />
                </span>
                <span className="flex-1 truncate text-xs font-semibold text-[var(--text-main)]">{item.category}</span>
                <span className="shrink-0 text-xs font-bold text-[var(--text-dim)]">{formatCurrency(item.amount)}</span>
              </motion.li>
            ))}
            {spendingBreakdown.length === 0 && (
              <li className="py-4 text-center text-sm text-[var(--text-dim)]">No expense data</li>
            )}
          </ul>
        </motion.article>

        {/* Violet stat card with sparkline (1/5) */}
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="relative col-span-1 overflow-hidden rounded-2xl bg-linear-to-br from-violet-600 to-purple-700 p-5 shadow-[var(--card-shadow)]"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-purple-400/20 blur-xl" />
          <div className="relative">
            <p className="text-xs font-semibold text-white/70">Transactions</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-white">
              {transactions.length.toLocaleString()}
            </p>
            <p className="mt-0.5 text-xs text-white/70">All time records</p>
          </div>
          <div className="relative mt-4 h-14">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartTrend.slice(-8)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fff" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#fff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="natural" dataKey="balance" stroke="rgba(255,255,255,0.8)" fill="url(#sparkGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {trendData.length > 1 && (
            <div className="relative mt-2 flex items-center justify-between">
              <span className="text-[10px] text-white/60">{trendData[0]?.month ?? ''}</span>
              <span className="text-[10px] text-white/60">{trendData[trendData.length - 1]?.month ?? ''}</span>
            </div>
          )}
        </motion.article>
      </div>
    </div>
  )
}
