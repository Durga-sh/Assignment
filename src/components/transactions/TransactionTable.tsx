import { motion } from 'framer-motion'
import { Pencil } from 'lucide-react'
import type { Transaction } from '../../types/finance'
import { formatCurrency } from '../../utils/format'
import { EmptyState } from '../common/EmptyState'

type TransactionTableProps = {
  groups: Record<string, Transaction[]>
  canEdit: boolean
  onEdit: (txn: Transaction) => void
}

export function TransactionTable({ groups, canEdit, onEdit }: TransactionTableProps) {
  const hasData = Object.values(groups).some((items) => items.length > 0)
  const columnCount = canEdit ? 6 : 5

  if (!hasData) {
    return <EmptyState title="No matching transactions" description="Try changing filter values or clear grouping." />
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--line)]">
      <div className="overflow-auto">
        <table className="min-w-full table-auto text-left text-sm">
          <thead className="bg-[var(--bg-main)]">
            <tr>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">Date</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">Category</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">Type</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">Amount</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">Note</th>
              {canEdit && <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">Action</th>}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groups).flatMap(([group, rows], groupIndex) => {
              const groupHeader = (
                <tr key={`group-${group}`} className={groupIndex > 0 ? 'border-t-2 border-[var(--line)]' : ''}>
                  <td colSpan={columnCount} className="bg-[var(--bg-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    {group} <span className="ml-1 rounded-full bg-[var(--accent-light)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--accent)]">{rows.length}</span>
                  </td>
                </tr>
              )

              const rowNodes = rows.map((txn, index) => (
                <motion.tr
                  key={txn.id}
                  layout
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 22, delay: Math.min(index * 0.012, 0.12) }}
                  whileHover={{ backgroundColor: 'color-mix(in srgb, var(--accent-light) 50%, transparent)' }}
                  className="border-t border-[var(--line)] transition-colors duration-150"
                >
                  <td className="px-4 py-3 text-xs text-[var(--text-dim)]">{txn.date}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-[var(--text-main)]">{txn.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        txn.type === 'income'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-violet-50 text-violet-700'
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-xs font-bold ${
                    txn.type === 'income' ? 'text-emerald-600' : 'text-[var(--text-main)]'
                  }`}>{formatCurrency(txn.amount)}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-dim)]">{txn.note}</td>
                  {canEdit && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onEdit(txn)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--line)] bg-[var(--bg-main)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text-main)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))

              return [groupHeader, ...rowNodes]
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
