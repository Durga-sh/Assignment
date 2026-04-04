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
          <thead className="bg-[var(--bg-main)] text-[var(--text-dim)]">
            <tr>
              <th className="px-3 py-2.5 font-semibold">Date</th>
              <th className="px-3 py-2.5 font-semibold">Category</th>
              <th className="px-3 py-2.5 font-semibold">Type</th>
              <th className="px-3 py-2.5 font-semibold">Amount</th>
              <th className="px-3 py-2.5 font-semibold">Note</th>
              {canEdit && <th className="px-3 py-2.5 font-semibold">Action</th>}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groups).flatMap(([group, rows], groupIndex) => {
              const groupHeader = (
                <tr key={`group-${group}`} className={groupIndex > 0 ? 'border-t-2 border-[var(--line)]' : ''}>
                  <td colSpan={columnCount} className="bg-[var(--bg-soft)] px-3 py-2 text-sm font-semibold text-[var(--text-main)]">
                    {group} ({rows.length})
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
                  whileHover={{ backgroundColor: 'color-mix(in srgb, var(--bg-soft) 45%, transparent)' }}
                  className="border-t border-[var(--line)] transition-colors duration-150"
                >
                  <td className="px-3 py-3 text-[var(--text-main)]">{txn.date}</td>
                  <td className="px-3 py-3 text-[var(--text-main)]">{txn.category}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        txn.type === 'income' ? 'bg-emerald-300/20 text-emerald-400' : 'bg-red-300/20 text-red-400'
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-semibold text-[var(--text-main)]">{formatCurrency(txn.amount)}</td>
                  <td className="px-3 py-3 text-[var(--text-dim)]">{txn.note}</td>
                  {canEdit && (
                    <td className="px-3 py-3">
                      <button
                        onClick={() => onEdit(txn)}
                        className="inline-flex items-center gap-1 rounded-md border border-[var(--line)] bg-[var(--bg-main)] px-2.5 py-1.5 text-xs text-[var(--text-main)] transition hover:border-[var(--accent)]"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
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
