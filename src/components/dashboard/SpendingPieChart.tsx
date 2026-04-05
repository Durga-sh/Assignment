import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../../utils/format'
import { EmptyState } from '../common/EmptyState'

const PIE_COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#f43f5e', '#6366f1', '#06b6d4']

type SpendingPieChartProps = {
  data: { category: string; amount: number }[]
  compact?: boolean
}

export function SpendingPieChart({ data, compact }: SpendingPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0)

  return (
    <article className={`flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] ${compact ? 'h-full p-3' : 'p-5'}`}>
      <h2 className={`font-bold text-[var(--text-main)] ${compact ? 'text-sm' : 'text-lg'}`}>Spending Breakdown</h2>
      <p className={`text-[var(--text-dim)] ${compact ? 'mb-2 text-xs' : 'mb-4 text-sm'}`}>Categorical expense view</p>
      <div className={`flex-1 min-h-0 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-main)] p-2 ${compact ? '' : 'h-80'}`}>
        {data.length === 0 ? (
          <EmptyState title="No spending data" description="Expense transactions are required for category breakdown." />
        ) : (
          <div className="grid h-full items-center gap-2 md:grid-cols-2">
            <div className="h-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={compact ? 40 : 64}
                    outerRadius={compact ? 70 : 108}
                    paddingAngle={2}
                    stroke="var(--bg-main)"
                    strokeWidth={2}
                  >
                    {data.map((slice, index) => (
                      <Cell key={slice.category} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 10, background: 'var(--bg-main)', borderColor: 'var(--line)' }}
                    formatter={(value) => formatCurrency(Number(value ?? 0))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className={`space-y-1.5 overflow-hidden pr-1 ${compact ? 'text-xs' : 'space-y-2 text-sm'}`}>
              {data.slice(0, compact ? 5 : 7).map((item, index) => {
                const pct = total > 0 ? ((item.amount / total) * 100).toFixed(1) : '0.0'
                return (
                  <li key={item.category} className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5 text-[var(--text-dim)]">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                      />
                      <span className="truncate">{item.category}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-[var(--text-main)]">{pct}%</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </article>
  )
}
