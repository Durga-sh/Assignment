import { motion } from 'framer-motion'
import { Activity, ArrowDownRight, ArrowUpRight, MoreHorizontal, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { LoadingPanel } from '../components/common/LoadingPanel'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency } from '../utils/format'

export function InsightsPage() {
  const { loading, summary, trendData, transactions } = useFinance()

  if (loading) return <LoadingPanel />

  const avgTxn =
    transactions.length > 0
      ? transactions.reduce((acc, txn) => acc + txn.amount, 0) / transactions.length
      : 0

  const incomeCoverage =
    summary.totalExpenses > 0 ? (summary.totalIncome / summary.totalExpenses) * 100 : 0

  const balanceDelta =
    trendData.length > 1 ? trendData[trendData.length - 1].balance - trendData[0].balance : 0

  const monthlyData = Array.from(
    transactions
      .reduce((acc, txn) => {
        const key = txn.date.slice(0, 7)
        const cur = acc.get(key) ?? { month: key, income: 0, expenses: 0 }
        if (txn.type === 'income') cur.income += txn.amount
        else cur.expenses += txn.amount
        acc.set(key, cur)
        return acc
      }, new Map<string, { month: string; income: number; expenses: number }>())
      .values(),
  )
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((row) => ({
      ...row,
      net: row.income - row.expenses,
      label: new Date(`${row.month}-01`).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    }))

  const kpi = [
    {
      label: 'Income Coverage',
      value: `${incomeCoverage.toFixed(0)}%`,
      hint: incomeCoverage >= 100 ? 'Expenses fully covered' : 'Coverage below 100%',
      icon: <TrendingUp size={18} />,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      dot: 'bg-violet-500',
    },
    {
      label: 'Avg. Transaction',
      value: formatCurrency(avgTxn),
      hint: `${transactions.length} total records`,
      icon: <Activity size={18} />,
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      dot: 'bg-cyan-500',
    },
    {
      label: 'Balance Growth',
      value: formatCurrency(Math.abs(balanceDelta)),
      hint: balanceDelta >= 0 ? 'Positive trajectory' : 'Negative trajectory',
      icon: balanceDelta >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />,
      iconBg: balanceDelta >= 0 ? 'bg-emerald-100' : 'bg-rose-100',
      iconColor: balanceDelta >= 0 ? 'text-emerald-600' : 'text-rose-500',
      dot: balanceDelta >= 0 ? 'bg-emerald-500' : 'bg-rose-500',
    },
  ]

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">

      {/* -- Row 1: KPI Cards ----------------------------------- */}
      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-3">
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
                <span className="text-[10px] text-[var(--text-dim)]">{card.hint}</span>
              </div>
            </div>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor}`}>
              {card.icon}
            </div>
          </motion.article>
        ))}
      </div>

      {/* -- Row 2: Monthly Bar Chart ---------------------------- */}
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="shrink-0 rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5 shadow-[var(--card-shadow)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[var(--text-main)]">Monthly Income vs Expenses</h2>
            <p className="text-xs text-[var(--text-dim)]">Side-by-side comparison across all months</p>
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
        <div className="h-56">
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
                <Bar dataKey="income" fill="#7c3aed" radius={[4, 4, 0, 0]} animationDuration={600} />
                <Bar dataKey="expenses" fill="#06b6d4" radius={[4, 4, 0, 0]} animationDuration={660} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.article>

      {/* -- Row 3: Breakdown Table + Balance Snapshots ---------- */}
      <div className="grid gap-4 pb-1 lg:grid-cols-5">

        {/* Monthly breakdown table (3/5) */}
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.18 }}
          className="col-span-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5 shadow-[var(--card-shadow)]"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-main)]">Monthly Breakdown</h2>
              <p className="text-xs text-[var(--text-dim)]">Income, expenses & net per month</p>
            </div>
            <button className="text-[var(--text-dim)] hover:text-[var(--text-main)]">
              <MoreHorizontal size={16} />
            </button>
          </div>
          {monthlyData.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--text-dim)]">No data yet.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[var(--line)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)] bg-[var(--bg-main)]">
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">Month</th>
                    <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">Income</th>
                    <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">Expenses</th>
                    <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((row, i) => (
                    <tr
                      key={row.month}
                      className={`border-b border-[var(--line)] last:border-0 transition-colors hover:bg-[var(--accent-light)]/40 ${i % 2 === 0 ? '' : 'bg-[var(--bg-main)]/40'}`}
                    >
                      <td className="px-4 py-3 font-semibold text-[var(--text-main)]">{row.label}</td>
                      <td className="px-4 py-3 text-right font-medium text-emerald-600">{formatCurrency(row.income)}</td>
                      <td className="px-4 py-3 text-right font-medium text-rose-500">{formatCurrency(row.expenses)}</td>
                      <td className={`px-4 py-3 text-right font-bold ${row.net >= 0 ? 'text-[var(--accent)]' : 'text-rose-500'}`}>
                        {row.net >= 0 ? '+' : ''}{formatCurrency(row.net)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.article>

        {/* Balance Snapshots (2/5) */}
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.22 }}
          className="col-span-2 rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5 shadow-[var(--card-shadow)]"
        >
          <div className="mb-4">
            <h2 className="text-sm font-bold text-[var(--text-main)]">Balance Snapshots</h2>
            <p className="text-xs text-[var(--text-dim)]">Tracked balance per month</p>
          </div>
          {trendData.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--text-dim)]">No snapshot data yet.</p>
          ) : (
            <ul className="space-y-2">
              {trendData.map((item, i) => {
                const prev = i > 0 ? trendData[i - 1].balance : item.balance
                const delta = item.balance - prev
                return (
                  <li
                    key={item.month}
                    className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--bg-main)] px-4 py-3 transition-colors hover:bg-[var(--accent-light)]/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                      <span className="text-xs font-semibold text-[var(--text-dim)]">{item.month}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {i > 0 && (
                        <span className={`text-[10px] font-semibold ${delta >= 0 ? 'text-emerald-500' : 'text-rose-400'}`}>
                          {delta >= 0 ? '+' : ''}{formatCurrency(delta)}
                        </span>
                      )}
                      <span className="text-sm font-bold text-[var(--text-main)]">{formatCurrency(item.balance)}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </motion.article>
      </div>
    </div>
  )
}
