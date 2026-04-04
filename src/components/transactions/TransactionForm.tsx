import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import type { Transaction, TransactionType } from '../../types/finance'

type TransactionFormProps = {
  editing: Transaction | null
  defaultType?: TransactionType
  categories: string[]
  onSubmit: (payload: Omit<Transaction, 'id'> | Transaction) => Promise<void>
  onClose: () => void
}

export function TransactionForm({ editing, defaultType = 'expense', categories, onSubmit, onClose }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: editing?.date ?? new Date().toISOString().slice(0, 10),
    amount: editing?.amount.toString() ?? '0',
    category: editing?.category ?? '',
    type: (editing?.type ?? defaultType) as TransactionType,
    note: editing?.note ?? '',
  })

  const baseCategories = categories.filter((item) => item !== 'all' && item.trim().length > 0)
  const categoryOptions = Array.from(new Set(baseCategories))

  if (editing?.category && !categoryOptions.includes(editing.category)) {
    categoryOptions.unshift(editing.category)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = {
      date: formData.date,
      amount: Number(formData.amount),
      category: formData.category.trim() || 'Other',
      type: formData.type,
      note: formData.note.trim() || 'Manual transaction',
    }

    if (editing) {
      await onSubmit({ ...payload, id: editing.id })
    } else {
      await onSubmit(payload)
    }

    onClose()
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      className="grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5 shadow-2xl md:grid-cols-3"
    >
      <div className="md:col-span-3">
        <h3 className="text-lg font-bold text-[var(--text-main)]">
          {editing ? 'Edit Transaction' : formData.type === 'income' ? 'Add Income' : 'Add Expense'}
        </h3>
        <p className="mt-0.5 text-sm text-[var(--text-dim)]">Use this popup to add or edit your financial entries.</p>
      </div>

      <input
        type="date"
        required
        value={formData.date}
        onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
        className="rounded-lg border border-[var(--line)] bg-[var(--bg-main)] px-3 py-2 text-sm"
      />
      <input
        type="number"
        min="1"
        required
        value={formData.amount}
        onChange={(event) => setFormData((prev) => ({ ...prev, amount: event.target.value }))}
        className="rounded-lg border border-[var(--line)] bg-[var(--bg-main)] px-3 py-2 text-sm"
        placeholder="Amount"
      />
      <select
        required
        value={formData.category}
        onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
        className="rounded-lg border border-[var(--line)] bg-[var(--bg-main)] px-3 py-2 text-sm"
      >
        <option value="" disabled>
          Select category
        </option>
        {categoryOptions.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
        value={formData.type}
        onChange={(event) => setFormData((prev) => ({ ...prev, type: event.target.value as TransactionType }))}
        className="rounded-lg border border-[var(--line)] bg-[var(--bg-main)] px-3 py-2 text-sm"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input
        value={formData.note}
        onChange={(event) => setFormData((prev) => ({ ...prev, note: event.target.value }))}
        className="rounded-lg border border-[var(--line)] bg-[var(--bg-main)] px-3 py-2 text-sm md:col-span-2"
        placeholder="Note"
      />
      <div className="flex gap-2 md:col-span-3">
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#012538]">
          {editing ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm text-[var(--text-main)]"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  )
}
