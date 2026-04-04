import { motion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useFinance } from '../context/FinanceContext'
import { LoadingPanel } from '../components/common/LoadingPanel'
import { formatCurrency } from '../utils/format'

export function InsightsPage() {
  const { loading, summary, trendData, transactions } = useFinance()

  if (loading) {
    return <LoadingPanel />
  }

  const avgTxn = transactions.length > 0
    ? transactions.reduce((acc, txn) => acc + txn.amount, 0) / transactions.length
    : 0

  const incomeCoverage = summary.totalExpenses > 0
    ? (summary.totalIncome / summary.totalExpenses) * 100
    : 0

  const monthlyIncomeExpenses = Array.from(
    transactions.reduce((acc, txn) => {
      const monthKey = txn.date.slice(0, 7)
      const current = acc.get(monthKey) ?? { month: monthKey, income: 0, expenses: 0 }

      if (txn.type === 'income') {
        current.income += txn.amount
      } else {
        current.expenses += txn.amount
      }

      acc.set(monthKey, current)
      return acc
    }, new Map<string, { month: string; income: number; expenses: number }>()).values(),
  )
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((row) => ({
      ...row,
      label: new Date(`${row.month}-01`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    }))

  const animatedStats = [
    {
      label: 'Income Coverage',
      value: `${incomeCoverage.toFixed(0)}%`,
      hint: incomeCoverage >= 100 ? 'Expenses fully covered' : 'Coverage below target',
      tone: 'text-emerald-400',
    },
    {
      label: 'Average Transaction',
      value: formatCurrency(avgTxn),
      hint: `${transactions.length} total records`,
      tone: 'text-sky-300',
    },
    {
      label: 'Balance Delta',
      value: trendData.length > 1
        ? formatCurrency(trendData[trendData.length - 1].balance - trendData[0].balance)
        : formatCurrency(0),
      hint: 'From first tracked month',
      tone: 'text-fuchsia-300',
    },
  ]

  return (
    <section className="space-y-5">
      <motion.article
        className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      >
        <motion.div
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[color-mix(in_srgb,var(--accent)_45%,transparent)] blur-2xl"
          animate={{ x: [0, -10, 0], y: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <h2 className="text-xl font-extrabold text-[var(--text-main)]">Financial Insights</h2>
        <p className="mt-1 text-sm text-[var(--text-dim)]">Smart readouts and monthly comparisons for your current financial rhythm.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {animatedStats.map((item, index) => (
            <motion.div
              key={item.label}
              className="rounded-xl border border-[var(--line)] bg-[var(--bg-main)] p-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.34 }}
              whileHover={{ y: -4, scale: 1.015 }}
            >
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-dim)]">{item.label}</p>
              <p className={`mt-2 text-2xl font-bold ${item.tone}`}>{item.value}</p>
              <p className="mt-1 text-xs text-[var(--text-dim)]">{item.hint}</p>
            </motion.div>
          ))}
        </div>
      </motion.article>

      <motion.article
        className="rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.38, ease: 'easeOut', delay: 0.05 }}
      >
        <h3 className="text-base font-bold text-[var(--text-main)]">Monthly Balance Bar Chart</h3>
        <p className="mb-4 text-sm text-[var(--text-dim)]">Monthly income vs expenses comparison.</p>

        <div className="mb-5 h-96 rounded-xl border border-[var(--line)] bg-[var(--bg-main)] p-3 md:h-[30rem]">
          {monthlyIncomeExpenses.length === 0 ? (
            <p className="grid h-full place-items-center text-sm text-[var(--text-dim)]">No monthly chart data yet.</p>
          ) : (
            <div className="mx-auto h-full w-full max-w-[980px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyIncomeExpenses}
                  margin={{ top: 6, right: 6, left: 6, bottom: 0 }}
                  barGap={0}
                  barCategoryGap="8%"
                >
                  <CartesianGrid stroke="var(--line)" strokeDasharray="3 6" vertical={false} opacity={0.55} />
                  <XAxis
                    dataKey="label"
                    stroke="var(--text-dim)"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="var(--text-dim)"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, background: 'var(--bg-surface)', borderColor: 'var(--line)' }}
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    formatter={(value, name) => [formatCurrency(Number(value ?? 0)), name === 'income' ? 'Income' : 'Expenses']}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: 10 }}
                    formatter={(value) => (
                      <span style={{ color: value === 'income' ? '#12c2ff' : '#5f7dff' }}>
                        {value === 'income' ? 'Income' : 'Expenses'}
                      </span>
                    )}
                  />
                  {/* barGap={0} on BarChart + no gap props on Bar = bars touch within a group */}
                  <Bar
                    dataKey="income"
                    fill="#12c2ff"
                    radius={[6, 6, 0, 0]}
                    barSize={48}
                    animationDuration={620}
                  />
                  <Bar
                    dataKey="expenses"
                    fill="#5f7dff"
                    radius={[6, 6, 0, 0]}
                    barSize={48}
                    animationDuration={680}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <h3 className="text-base font-bold text-[var(--text-main)]">Monthly Momentum Timeline</h3>
        <p className="mb-4 text-sm text-[var(--text-dim)]">Balance path rendered as an animated sequence.</p>

        <div className="grid gap-3 md:grid-cols-3">
          {trendData.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[var(--line)] px-3 py-4 text-sm text-[var(--text-dim)] md:col-span-3">
              No monthly momentum data yet.
            </p>
          ) : (
            trendData.map((item, index) => (
              <motion.div
                key={item.month}
                className="relative rounded-xl border border-[var(--line)] bg-[var(--bg-main)] p-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07, duration: 0.32 }}
              >
                <motion.span
                  className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[var(--accent)]"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.15 }}
                />
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-dim)]">{item.month}</p>
                <p className="mt-2 text-lg font-bold text-[var(--text-main)]">{formatCurrency(item.balance)}</p>
              </motion.div>
            ))
          )}
        </div>
      </motion.article>
    </section>
  )
}