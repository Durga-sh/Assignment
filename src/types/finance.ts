export type Role = 'viewer' | 'admin'
export type TransactionType = 'income' | 'expense'
export type ThemeMode = 'light' | 'dark'

export type Transaction = {
  id: string
  date: string
  amount: number
  category: string
  type: TransactionType
  note: string
}

export type TransactionFilters = {
  query: string
  type: 'all' | TransactionType
  category: 'all' | string
  minAmount: string
  maxAmount: string
  dateFrom: string
  dateTo: string
  groupBy: 'none' | 'category' | 'month' | 'type'
}

export type SortState = {
  field: 'date' | 'amount'
  direction: 'asc' | 'desc'
}
