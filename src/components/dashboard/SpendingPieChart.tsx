import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../../utils/format'
import { EmptyState } from '../common/EmptyState'

const PIE_COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#f43f5e', '#6366f1', '#06b6d4']

type SpendingPieChartProps = {
  data: { category: string; amount: number }[]
}

export function SpendingPieChart({ data }: SpendingPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0)

  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5">
      <h2 className="text-lg font-bold text-[var(--text-main)]">Spending Breakdown</h2>
      <p className="mb-4 text-sm text-[var(--text-dim)]">Categorical expense view</p>
      <div className="h-80 rounded-xl border border-[var(--line)] bg-[var(--bg-main)] p-3">
        {data.length === 0 ? (
          <EmptyState title="No spending data" description="Expense transactions are required for category breakdown." />
        ) : (
          <div className="grid h-full items-center gap-3 md:grid-cols-2">
            <div className="h-full min-h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={64}
                    outerRadius={108}
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

            <ul className="space-y-2 pr-2">
              {data.slice(0, 7).map((item, index) => {
                const pct = total > 0 ? ((item.amount / total) * 100).toFixed(1) : '0.0'
                return (
                  <li key={item.category} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 text-[var(--text-dim)]">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                      />
                      {item.category}
                    </span>
                    <span className="font-semibold text-[var(--text-main)]">{pct}%</span>
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
