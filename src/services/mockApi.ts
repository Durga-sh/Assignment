import { MOCK_TRANSACTIONS } from '../data/mockTransactions'
import type { Transaction } from '../types/finance'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const STORAGE_KEY = 'zorvyn_transactions_v3'

const readTransactions = (): Transaction[] => {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    const seeded = structuredClone(MOCK_TRANSACTIONS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
  }

  try {
    const parsed = JSON.parse(raw) as Transaction[]
    if (Array.isArray(parsed)) {
      return parsed
    }
  } catch {
    // Ignore parse issues and recover using seed data.
  }

  const seeded = structuredClone(MOCK_TRANSACTIONS)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
  return seeded
}

const writeTransactions = (items: Transaction[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const generateTransactionId = () => {
  const random = Math.floor(100 + Math.random() * 900)
  return `TXN-${Date.now()}-${random}`
}

export const mockApi = {
  async getTransactions(): Promise<Transaction[]> {
    await delay(500)
    return structuredClone(readTransactions())
  },

  async createTransaction(payload: Omit<Transaction, 'id'>): Promise<Transaction> {
    await delay(280)
    const created: Transaction = {
      ...payload,
      id: generateTransactionId(),
    }

    const current = readTransactions()
    writeTransactions([created, ...current])
    return created
  },

  async updateTransaction(payload: Transaction): Promise<Transaction> {
    await delay(280)
    const current = readTransactions()
    writeTransactions(current.map((item) => (item.id === payload.id ? payload : item)))
    return payload
  },
}
