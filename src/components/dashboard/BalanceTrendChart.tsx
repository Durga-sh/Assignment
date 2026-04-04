import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../../utils/format'
import { EmptyState } from '../common/EmptyState'

type BalanceTrendChartProps = {
  data: { month: string; balance: number }[]
}

export function BalanceTrendChart({ data }: BalanceTrendChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: new Date(`${item.month}-01`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  }))

  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5">
      <h2 className="text-lg font-bold text-[var(--text-main)]">Balance Trend</h2>
      <p className="mb-4 text-sm text-[var(--text-dim)]">Time-based running balance</p>
      <div className="h-80 rounded-xl border border-[var(--line)] bg-[var(--bg-main)] p-3">
        {chartData.length === 0 ? (
          <EmptyState title="No trend data" description="Add transactions to render trend analytics." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 6 }}>
              <defs>
                <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.65} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--line)" strokeDasharray="3 5" vertical={false} opacity={0.55} />
              <XAxis
                dataKey="label"
                stroke="var(--text-dim)"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={22}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="var(--text-dim)"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={58}
                tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}
              />
              <Tooltip
                contentStyle={{ borderRadius: 10, background: 'var(--bg-main)', borderColor: 'var(--line)' }}
                formatter={(value) => formatCurrency(Number(value ?? 0))}
                cursor={{ fill: 'transparent' }}
              />
              <Area type="natural" dataKey="balance" stroke="#0ea5e9" fill="url(#trend)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </article>
  )
}
