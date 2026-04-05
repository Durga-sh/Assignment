import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Plus } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { LoadingPanel } from '../components/common/LoadingPanel'
import { ExportButtons } from '../components/transactions/ExportButtons'
import { TransactionFilters } from '../components/transactions/TransactionFilters'
import { TransactionForm } from '../components/transactions/TransactionForm'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useFinance } from '../context/useFinance'
import { can } from '../lib/permissions'
import type { Transaction, TransactionType } from '../types/finance'
import { exportTransactionsCSV, exportTransactionsJSON } from '../utils/export'

export function TransactionsPage() {
  const loading = useFinance((state) => state.loading)
  const role = useFinance((state) => state.role)
  const filteredTransactions = useFinance((state) => state.filteredTransactions)
  const groupedTransactions = useFinance((state) => state.groupedTransactions)
  const categories = useFinance((state) => state.categories)
  const filters = useFinance((state) => state.filters)
  const setFilters = useFinance((state) => state.setFilters)
  const sort = useFinance((state) => state.sort)
  const setSort = useFinance((state) => state.setSort)
  const addTransaction = useFinance((state) => state.addTransaction)
  const updateTransaction = useFinance((state) => state.updateTransaction)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [createType, setCreateType] = useState<TransactionType>('expense')

  const canCreate = can(role, 'create:transaction')
  const canEdit = can(role, 'edit:transaction')
  const canExport = can(role, 'export:data')

  if (loading) return <LoadingPanel />

  const openCreate = (type: TransactionType) => {
    if (!canCreate) return
    setEditing(null)
    setCreateType(type)
    setShowForm(true)
  }

  const openEdit = (txn: Transaction) => {
    if (!canEdit) return
    setEditing(txn)
    setShowForm(true)
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {!canCreate && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-start gap-3 rounded-xl border border-[var(--accent)]/25 bg-[var(--accent-light)] px-4 py-3.5"
        >
          <Eye size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
          <div>
            <p className="text-sm font-bold text-[var(--accent)]">Read-Only Access</p>
            <p className="text-xs text-[var(--text-main)] opacity-70">
              You are viewing as <strong>Viewer</strong>. Switch to <strong>Admin</strong> from the top-right to add or edit transactions.
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Card>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-bold text-[var(--text-main)]">All Transactions</h2>
              <p className="text-xs text-[var(--text-dim)]">Filter, search and manage your financial records</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {canExport && (
                <ExportButtons
                  onCSV={() => exportTransactionsCSV(filteredTransactions)}
                  onJSON={() => exportTransactionsJSON(filteredTransactions)}
                />
              )}

              {canCreate && (
                <>
                  <Button onClick={() => openCreate('income')} variant="success" leftIcon={<Plus size={14} />}>
                    Add Income
                  </Button>
                  <Button onClick={() => openCreate('expense')} variant="primary" leftIcon={<Plus size={14} />}>
                    Add Expense
                  </Button>
                </>
              )}
            </div>
          </div>

          <TransactionFilters
            filters={filters}
            categories={categories}
            sort={sort}
            onFiltersChange={setFilters}
            onSortChange={setSort}
          />
        </Card>
      </motion.div>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence mode="wait">
            {showForm && canCreate && (
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

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
      >
        <Card>
          <TransactionTable groups={groupedTransactions} canEdit={canEdit} onEdit={openEdit} />
        </Card>
      </motion.div>
    </motion.div>
  )
}