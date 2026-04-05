import { create } from 'zustand'
import { STARTING_BALANCE } from '../data/mockTransactions'
import { mockApi } from '../services/mockApi'
import type {
  Role,
  SortState,
  ThemeMode,
  Transaction,
  TransactionFilters,
} from '../types/finance'

const STORAGE_KEYS = {
  role: 'zorvyn_role',
  theme: 'zorvyn_theme',
}

const defaultFilters: TransactionFilters = {
  query: '',
  type: 'all',
  category: 'all',
  minAmount: '',
  maxAmount: '',
  dateFrom: '',
  dateTo: '',
  groupBy: 'none',
}

type Summary = {
  totalIncome: number
  totalExpenses: number
  totalBalance: number
}

type Insights = {
  highestCategory: string
  monthlyComparison: string
  observation: string
}

type DerivedState = {
  categories: string[]
  filteredTransactions: Transaction[]
  groupedTransactions: Record<string, Transaction[]>
  summary: Summary
  trendData: { month: string; balance: number }[]
  spendingBreakdown: { category: string; amount: number }[]
  insights: Insights
}

export type FinanceStore = {
  loading: boolean
  role: Role
  theme: ThemeMode
  transactions: Transaction[]
  filters: TransactionFilters
  sort: SortState
  categories: string[]
  filteredTransactions: Transaction[]
  groupedTransactions: Record<string, Transaction[]>
  summary: Summary
  trendData: { month: string; balance: number }[]
  spendingBreakdown: { category: string; amount: number }[]
  insights: Insights
  bootstrap: () => Promise<void>
  setRole: (role: Role) => void
  setTheme: (theme: ThemeMode) => void
  setFilters: (filters: TransactionFilters) => void
  setSort: (sort: SortState) => void
  addTransaction: (payload: Omit<Transaction, 'id'>) => Promise<void>
  updateTransaction: (payload: Transaction) => Promise<void>
}

const safeParse = <T,>(raw: string | null): T | null => {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

const readStored = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  return safeParse<T>(window.localStorage.getItem(key)) ?? fallback
}

const applyTheme = (theme: ThemeMode) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

const getDateTimestamp = (date: string) => {
  const parsed = new Date(date).getTime()
  return Number.isFinite(parsed) ? parsed : 0
}

const getCreatedTimestampFromId = (id: string) => {
  const parts = id.split('-')
  const raw = parts.length >= 3 ? Number(parts[1]) : 0
  return Number.isFinite(raw) ? raw : 0
}

const deriveState = (
  transactions: Transaction[],
  filters: TransactionFilters,
  sort: SortState,
): DerivedState => {
  const categories = ['all', ...new Set(transactions.map((item) => item.category))]

  const query = filters.query.trim().toLowerCase()
  const min = filters.minAmount ? Number(filters.minAmount) : null
  const max = filters.maxAmount ? Number(filters.maxAmount) : null

  const filteredTransactions = transactions
    .filter((item) => {
      const matchesQuery =
        query.length === 0 ||
        item.category.toLowerCase().includes(query) ||
        item.note.toLowerCase().includes(query)
      const matchesType = filters.type === 'all' || item.type === filters.type
      const matchesCategory = filters.category === 'all' || item.category === filters.category
      const matchesMin = min === null || item.amount >= min
      const matchesMax = max === null || item.amount <= max
      const matchesFrom = !filters.dateFrom || item.date >= filters.dateFrom
      const matchesTo = !filters.dateTo || item.date <= filters.dateTo

      return (
        matchesQuery &&
        matchesType &&
        matchesCategory &&
        matchesMin &&
        matchesMax &&
        matchesFrom &&
        matchesTo
      )
    })
    .sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1
      if (sort.field === 'amount') {
        return (a.amount - b.amount) * direction
      }

      const dateDelta = getDateTimestamp(a.date) - getDateTimestamp(b.date)
      if (dateDelta !== 0) {
        return dateDelta * direction
      }

      // Keep newly created items deterministic when date is same.
      return (getCreatedTimestampFromId(a.id) - getCreatedTimestampFromId(b.id)) * direction
    })

  const groupedTransactions =
    filters.groupBy === 'none'
      ? { All: filteredTransactions }
      : filteredTransactions.reduce<Record<string, Transaction[]>>((acc, item) => {
          const key =
            filters.groupBy === 'category'
              ? item.category
              : filters.groupBy === 'month'
                ? item.date.slice(0, 7)
                : item.type

          if (!acc[key]) acc[key] = []
          acc[key].push(item)
          return acc
        }, {})

  const totalIncome = transactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = transactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0)

  const summary: Summary = {
    totalIncome,
    totalExpenses,
    totalBalance: STARTING_BALANCE + totalIncome - totalExpenses,
  }

  const trendGrouped = new Map<string, number>()
  transactions
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((item) => {
      const month = item.date.slice(0, 7)
      const signed = item.type === 'income' ? item.amount : -item.amount
      trendGrouped.set(month, (trendGrouped.get(month) ?? 0) + signed)
    })

  let running = STARTING_BALANCE
  const trendData = Array.from(trendGrouped.entries()).map(([month, delta]) => {
    running += delta
    return { month, balance: running }
  })

  const expenseGrouped = new Map<string, number>()
  transactions
    .filter((item) => item.type === 'expense')
    .forEach((item) => {
      expenseGrouped.set(item.category, (expenseGrouped.get(item.category) ?? 0) + item.amount)
    })

  const spendingBreakdown = Array.from(expenseGrouped.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)

  const highest = spendingBreakdown[0]
  const monthlyExpenses = new Map<string, number>()
  transactions
    .filter((item) => item.type === 'expense')
    .forEach((item) => {
      const month = item.date.slice(0, 7)
      monthlyExpenses.set(month, (monthlyExpenses.get(month) ?? 0) + item.amount)
    })

  const sorted = Array.from(monthlyExpenses.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  const current = sorted[sorted.length - 1]
  const previous = sorted[sorted.length - 2]

  const monthlyComparison =
    current && previous
      ? `${current[0]} vs ${previous[0]}: ${Math.abs(current[1] - previous[1]).toLocaleString('en-IN')} ${
          current[1] >= previous[1] ? 'higher' : 'lower'
        } expense.`
      : 'Not enough monthly records for comparison.'

  const insights: Insights = {
    highestCategory: highest
      ? `${highest.category} (${highest.amount.toLocaleString('en-IN')})`
      : 'No expense data available',
    monthlyComparison,
    observation:
      summary.totalIncome >= summary.totalExpenses
        ? `Income currently exceeds expenses by ${(summary.totalIncome - summary.totalExpenses).toLocaleString('en-IN')}.`
        : `Expenses currently exceed income by ${(summary.totalExpenses - summary.totalIncome).toLocaleString('en-IN')}.`,
  }

  return {
    categories,
    filteredTransactions,
    groupedTransactions,
    summary,
    trendData,
    spendingBreakdown,
    insights,
  }
}

const initialRole = readStored<Role>(STORAGE_KEYS.role, 'viewer')
const initialTheme = readStored<ThemeMode>(STORAGE_KEYS.theme, 'dark')
applyTheme(initialTheme)

const initialDerived = deriveState([], defaultFilters, { field: 'date', direction: 'desc' })

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  loading: true,
  role: initialRole,
  theme: initialTheme,
  transactions: [],
  filters: defaultFilters,
  sort: { field: 'date', direction: 'desc' },
  ...initialDerived,

  bootstrap: async () => {
    const { loading } = get()
    if (!loading) return

    try {
      const data = await mockApi.getTransactions()
      const { filters, sort } = get()
      set({
        loading: false,
        transactions: data,
        ...deriveState(data, filters, sort),
      })
    } catch {
      set({ loading: false })
    }
  },

  setRole: (role) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.role, JSON.stringify(role))
    }
    set({ role })
  },

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme))
    }
    applyTheme(theme)
    set({ theme })
  },

  setFilters: (filters) => {
    const { transactions, sort } = get()
    set({
      filters,
      ...deriveState(transactions, filters, sort),
    })
  },

  setSort: (sort) => {
    const { transactions, filters } = get()
    set({
      sort,
      ...deriveState(transactions, filters, sort),
    })
  },

  addTransaction: async (payload) => {
    const created = await mockApi.createTransaction(payload)
    const transactions = [created, ...get().transactions]
    const { filters, sort } = get()
    set({
      transactions,
      ...deriveState(transactions, filters, sort),
    })
  },

  updateTransaction: async (payload) => {
    const updated = await mockApi.updateTransaction(payload)
    const transactions = get().transactions.map((item) => (item.id === updated.id ? updated : item))
    const { filters, sort } = get()
    set({
      transactions,
      ...deriveState(transactions, filters, sort),
    })
  },
}))