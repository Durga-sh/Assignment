import { AnimatePresence, motion } from 'framer-motion'
import { Lock, Plus } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { LoadingPanel } from '../components/common/LoadingPanel'
import { ExportButtons } from '../components/transactions/ExportButtons'
import { TransactionFilters } from '../components/transactions/TransactionFilters'
import { TransactionForm } from '../components/transactions/TransactionForm'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { useFinance } from '../context/FinanceContext'
import type { Transaction, TransactionType } from '../types/finance'
import { exportTransactionsCSV, exportTransactionsJSON } from '../utils/export'

export function TransactionsPage() {
  const {
    loading,
    role,
    filteredTransactions,
    groupedTransactions,
    categories,
    filters,
    setFilters,
    sort,
    setSort,
    addTransaction,
    updateTransaction,
  } = useFinance()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [createType, setCreateType] = useState<TransactionType>('expense')

  if (loading) {
    return <LoadingPanel />
  }

  const openCreate = (type: TransactionType) => {
    setEditing(null)
    setCreateType(type)
    setShowForm(true)
  }

  const openEdit = (txn: Transaction) => {
    setEditing(txn)
    setShowForm(true)
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 110, damping: 18 }}
    >
      <motion.article
        className="rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-bold text-[var(--text-main)]">Transactions</h2>
          <div className="flex flex-wrap gap-2">
            <ExportButtons
              onCSV={() => exportTransactionsCSV(filteredTransactions)}
              onJSON={() => exportTransactionsJSON(filteredTransactions)}
            />
            <>
              <button
                onClick={() => openCreate('income')}
                disabled={role !== 'admin'}
                title={role !== 'admin' ? 'Switch role to Admin to add transactions' : 'Add new income'}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-[#072615] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {role !== 'admin' ? <Lock size={14} /> : <Plus size={15} />} Add Income
              </button>
              <button
                onClick={() => openCreate('expense')}
                disabled={role !== 'admin'}
                title={role !== 'admin' ? 'Switch role to Admin to add transactions' : 'Add new expense'}
                className="inline-flex items-center gap-1 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[#031824] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {role !== 'admin' ? <Lock size={14} /> : <Plus size={15} />} Add Expense
              </button>
            </>
          </div>
        </div>

        <TransactionFilters
          filters={filters}
          categories={categories}
          sort={sort}
          onFiltersChange={setFilters}
          onSortChange={setSort}
        />
      </motion.article>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence mode="wait">
            {showForm && role === 'admin' && (
              <motion.div
                className="fixed inset-0 z-[120] grid place-items-center bg-black/55 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowForm(false)}
              >
                <motion.div
                  className="w-full max-w-3xl"
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 14, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <TransactionForm
                    editing={editing}
                    defaultType={createType}
                    categories={categories}
                    onSubmit={async (payload) => {
                      if ('id' in payload) {
                        await updateTransaction(payload)
                      } else {
                        await addTransaction(payload)
                      }
                    }}
                    onClose={() => setShowForm(false)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      <motion.article
        className="rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      >
        <TransactionTable groups={groupedTransactions} canEdit={role === 'admin'} onEdit={openEdit} />
      </motion.article>
    </motion.div>
  )
}
