import type { Transaction } from '../types/finance'

export const STARTING_BALANCE = 18500

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-101', date: '2026-01-03', amount: 6200, category: 'Salary', type: 'income', note: 'Monthly payroll' },
  { id: 'TXN-102', date: '2026-01-06', amount: 1400, category: 'Freelance', type: 'income', note: 'Landing page project' },
  { id: 'TXN-103', date: '2026-01-08', amount: 920, category: 'Rent', type: 'expense', note: 'Apartment rent split' },
  { id: 'TXN-104', date: '2026-01-10', amount: 210, category: 'Food', type: 'expense', note: 'Groceries and pantry' },
  { id: 'TXN-105', date: '2026-02-02', amount: 6200, category: 'Salary', type: 'income', note: 'Monthly payroll' },
  { id: 'TXN-106', date: '2026-02-07', amount: 330, category: 'Transport', type: 'expense', note: 'Metro card and fuel' },
  { id: 'TXN-107', date: '2026-02-15', amount: 190, category: 'Entertainment', type: 'expense', note: 'Movie and dinner' },
  { id: 'TXN-108', date: '2026-02-24', amount: 560, category: 'Utilities', type: 'expense', note: 'Power and internet bill' },
  { id: 'TXN-109', date: '2026-03-01', amount: 6200, category: 'Salary', type: 'income', note: 'Monthly payroll' },
  { id: 'TXN-110', date: '2026-03-04', amount: 1100, category: 'Investments', type: 'income', note: 'Mutual fund profit booking' },
  { id: 'TXN-111', date: '2026-03-12', amount: 980, category: 'Rent', type: 'expense', note: 'Apartment rent split' },
  { id: 'TXN-112', date: '2026-03-18', amount: 360, category: 'Health', type: 'expense', note: 'Clinic visit and medicines' },
  { id: 'TXN-113', date: '2026-03-27', amount: 260, category: 'Food', type: 'expense', note: 'Weekend groceries' },
]
