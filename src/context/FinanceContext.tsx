import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
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

type FinanceContextType = {
  loading: boolean
  role: Role
  setRole: (role: Role) => void
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  transactions: Transaction[]
  filteredTransactions: Transaction[]
  groupedTransactions: Record<string, Transaction[]>
  categories: string[]
  filters: TransactionFilters
  setFilters: (filters: TransactionFilters) => void
  sort: SortState
  setSort: (sort: SortState) => void
  summary: {
    totalIncome: number
    totalExpenses: number
    totalBalance: number
  }
  trendData: { month: string; balance: number }[]
  spendingBreakdown: { category: string; amount: number }[]
  insights: {
    highestCategory: string
    monthlyComparison: string
    observation: string
  }
  addTransaction: (payload: Omit<Transaction, 'id'>) => Promise<void>
  updateTransaction: (payload: Transaction) => Promise<void>
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

const safeParse = <T,>(raw: string | null): T | null => {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters)
  const [sort, setSort] = useState<SortState>({ field: 'date', direction: 'desc' })
  const [role, setRole] = useState<Role>(() => safeParse<Role>(localStorage.getItem(STORAGE_KEYS.role)) ?? 'viewer')
  const [theme, setTheme] = useState<ThemeMode>(() => safeParse<ThemeMode>(localStorage.getItem(STORAGE_KEYS.theme)) ?? 'dark')

  useEffect(() => {
    const bootstrap = async () => {
      const data = await mockApi.getTransactions()
      setTransactions(data)
      setLoading(false)
    }

    void bootstrap()
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.role, JSON.stringify(role))
  }, [role])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme))
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const categories = useMemo(() => ['all', ...new Set(transactions.map((item) => item.category))], [transactions])

  const filteredTransactions = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    const min = filters.minAmount ? Number(filters.minAmount) : null
    const max = filters.maxAmount ? Number(filters.maxAmount) : null

    return transactions
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
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction
      })
  }, [filters, sort, transactions])

  const groupedTransactions = useMemo(() => {
    if (filters.groupBy === 'none') {
      return { All: filteredTransactions }
    }

    return filteredTransactions.reduce<Record<string, Transaction[]>>((acc, item) => {
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
  }, [filteredTransactions, filters.groupBy])

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0)
    const totalExpenses = transactions
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0)

    return {
      totalIncome,
      totalExpenses,
      totalBalance: STARTING_BALANCE + totalIncome - totalExpenses,
    }
  }, [transactions])

  const trendData = useMemo(() => {
    const grouped = new Map<string, number>()

    transactions
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach((item) => {
        const month = item.date.slice(0, 7)
        const signed = item.type === 'income' ? item.amount : -item.amount
        grouped.set(month, (grouped.get(month) ?? 0) + signed)
      })

    let running = STARTING_BALANCE
    return Array.from(grouped.entries()).map(([month, delta]) => {
      running += delta
      return { month, balance: running }
    })
  }, [transactions])

  const spendingBreakdown = useMemo(() => {
    const grouped = new Map<string, number>()
    transactions
      .filter((item) => item.type === 'expense')
      .forEach((item) => {
        grouped.set(item.category, (grouped.get(item.category) ?? 0) + item.amount)
      })

    return Array.from(grouped.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
  }, [transactions])

  const insights = useMemo(() => {
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

    return {
      highestCategory: highest
        ? `${highest.category} (${highest.amount.toLocaleString('en-IN')})`
        : 'No expense data available',
      monthlyComparison,
      observation:
        summary.totalIncome >= summary.totalExpenses
          ? `Income currently exceeds expenses by ${(summary.totalIncome - summary.totalExpenses).toLocaleString('en-IN')}.`
          : `Expenses currently exceed income by ${(summary.totalExpenses - summary.totalIncome).toLocaleString('en-IN')}.`,
    }
  }, [spendingBreakdown, summary.totalExpenses, summary.totalIncome, transactions])

  const addTransaction = async (payload: Omit<Transaction, 'id'>) => {
    const created = await mockApi.createTransaction(payload)
    setTransactions((prev) => [created, ...prev])
  }

  const updateTransaction = async (payload: Transaction) => {
    const updated = await mockApi.updateTransaction(payload)
    setTransactions((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
  }

  const value: FinanceContextType = {
    loading,
    role,
    setRole,
    theme,
    setTheme,
    transactions,
    filteredTransactions,
    groupedTransactions,
    categories,
    filters,
    setFilters,
    sort,
    setSort,
    summary,
    trendData,
    spendingBreakdown,
    insights,
    addTransaction,
    updateTransaction,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used inside FinanceProvider')
  }
  return context
}
