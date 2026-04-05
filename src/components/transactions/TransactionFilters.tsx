import { Search } from 'lucide-react'
import type { SortState, TransactionFilters } from '../../types/finance'

type TransactionFiltersProps = {
  filters: TransactionFilters
  categories: string[]
  sort: SortState
  onFiltersChange: (filters: TransactionFilters) => void
  onSortChange: (sort: SortState) => void
}

export function TransactionFilters({
  filters,
  categories,
  sort,
  onFiltersChange,
  onSortChange,
}: TransactionFiltersProps) {
  const inputCls = 'rounded-xl border border-[var(--line)] bg-[var(--bg-main)] px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] transition-colors'

  return (
    <div className="grid gap-2 md:grid-cols-4 xl:grid-cols-8">
      <label className="relative xl:col-span-2">
        <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-[var(--text-dim)]" />
        <input
          value={filters.query}
          onChange={(event) => onFiltersChange({ ...filters, query: event.target.value })}
          placeholder="Search category or note"
          className={`w-full pl-8 ${inputCls}`}
        />
      </label>

      <select
        value={filters.type}
        onChange={(event) => onFiltersChange({ ...filters, type: event.target.value as TransactionFilters['type'] })}
        className={inputCls}
      >
        <option value="all">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        value={filters.category}
        onChange={(event) => onFiltersChange({ ...filters, category: event.target.value })}
        className={inputCls}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category === 'all' ? 'All categories' : category}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="0"
        value={filters.minAmount}
        onChange={(event) => onFiltersChange({ ...filters, minAmount: event.target.value })}
        placeholder="Min amount"
        className={inputCls}
      />

      <input
        type="number"
        min="0"
        value={filters.maxAmount}
        onChange={(event) => onFiltersChange({ ...filters, maxAmount: event.target.value })}
        placeholder="Max amount"
        className={inputCls}
      />

      <input
        type="date"
        value={filters.dateFrom}
        onChange={(event) => onFiltersChange({ ...filters, dateFrom: event.target.value })}
        className={inputCls}
      />

      <input
        type="date"
        value={filters.dateTo}
        onChange={(event) => onFiltersChange({ ...filters, dateTo: event.target.value })}
        className={inputCls}
      />

      <select
        value={sort.field + ':' + sort.direction}
        onChange={(event) => {
          const [field, direction] = event.target.value.split(':')
          onSortChange({ field: field as SortState['field'], direction: direction as SortState['direction'] })
        }}
        className={inputCls}
      >
        <option value="date:desc">Newest first</option>
        <option value="date:asc">Oldest first</option>
        <option value="amount:desc">Amount high to low</option>
        <option value="amount:asc">Amount low to high</option>
      </select>

      <select
        value={filters.groupBy}
        onChange={(event) => onFiltersChange({ ...filters, groupBy: event.target.value as TransactionFilters['groupBy'] })}
        className={inputCls}
      >
        <option value="none">No grouping</option>
        <option value="category">Group by category</option>
        <option value="month">Group by month</option>
        <option value="type">Group by type</option>
      </select>
    </div>
  )
}
