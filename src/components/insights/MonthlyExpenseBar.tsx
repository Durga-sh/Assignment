import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../../utils/format'
import { EmptyState } from '../common/EmptyState'

type MonthlyExpenseBarProps = {
  trendData: { month: string; balance: number }[]
}

export function MonthlyExpenseBar({ trendData }: MonthlyExpenseBarProps) {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5">
      <h2 className="text-lg font-bold text-[var(--text-main)]">Monthly Movement</h2>
      <p className="mb-4 text-sm text-[var(--text-dim)]">Comparative balance by month</p>
      <div className="h-72">
        {trendData.length === 0 ? (
          <EmptyState title="No monthly data" description="Monthly chart appears when transactions exist." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceBars" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="color-mix(in srgb, var(--accent) 82%, white 18%)" />
                  <stop offset="100%" stopColor="color-mix(in srgb, var(--accent) 62%, #0a3149 38%)" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--line)" strokeDasharray="2 6" vertical={false} opacity={0.45} />
              <XAxis dataKey="month" stroke="var(--text-dim)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                stroke="var(--text-dim)"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, background: 'var(--bg-main)', borderColor: 'var(--line)' }}
                cursor={{ fill: 'transparent' }}
                formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Balance']}
              />
              <Bar
                dataKey="balance"
                fill="url(#balanceBars)"
                radius={[6, 6, 0, 0]}
                barSize={34}
                animationDuration={520}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </article>
  )
}
