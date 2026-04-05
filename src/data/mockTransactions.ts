import type { Transaction } from '../types/finance'

export const STARTING_BALANCE = 18500

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-101', date: '2026-01-03', amount: 6200, category: 'Salary', type: 'income', note: 'Monthly payroll' },
  { id: 'TXN-102', date: '2026-01-06', amount: 1400, category: 'Freelance', type: 'income', note: 'Landing page project' },
  { id: 'TXN-103', date: '2026-01-08', amount: 920, category: 'Rent', type: 'expense', note: 'Apartment rent split' },
  { id: 'TXN-104', date: '2026-01-10', amount: 210, category: 'Food', type: 'expense', note: 'Groceries and pantry' },
  { id: 'TXN-114', date: '2026-01-17', amount: 180, category: 'Subscriptions', type: 'expense', note: 'Streaming services' },
  { id: 'TXN-115', date: '2026-01-22', amount: 750, category: 'Bonus', type: 'income', note: 'Performance incentive' },
  { id: 'TXN-105', date: '2026-02-02', amount: 9800, category: 'Salary', type: 'income', note: 'Monthly payroll' },
  { id: 'TXN-106', date: '2026-02-07', amount: 330, category: 'Transport', type: 'expense', note: 'Metro card and fuel' },
  { id: 'TXN-107', date: '2026-02-15', amount: 190, category: 'Entertainment', type: 'expense', note: 'Movie and dinner' },
  { id: 'TXN-108', date: '2026-02-24', amount: 560, category: 'Utilities', type: 'expense', note: 'Power and internet bill' },
  { id: 'TXN-116', date: '2026-02-26', amount: 460, category: 'Shopping', type: 'expense', note: 'Clothing and essentials' },
  { id: 'TXN-109', date: '2026-03-01', amount: 9800, category: 'Salary', type: 'income', note: 'Monthly payroll' },
  { id: 'TXN-110', date: '2026-03-04', amount: 2600, category: 'Investments', type: 'income', note: 'Mutual fund profit booking' },
  { id: 'TXN-111', date: '2026-03-12', amount: 980, category: 'Rent', type: 'expense', note: 'Apartment rent split' },
  { id: 'TXN-112', date: '2026-03-18', amount: 360, category: 'Health', type: 'expense', note: 'Clinic visit and medicines' },
  { id: 'TXN-113', date: '2026-03-27', amount: 260, category: 'Food', type: 'expense', note: 'Weekend groceries' },
  { id: 'TXN-117', date: '2026-03-29', amount: 1800, category: 'Freelance', type: 'income', note: 'Logo redesign project' },
  { id: 'TXN-118', date: '2026-04-01', amount: 15000, category: 'Salary', type: 'income', note: 'Monthly payroll' },
  { id: 'TXN-119', date: '2026-04-03', amount: 980, category: 'Rent', type: 'expense', note: 'Apartment rent split' },
  { id: 'TXN-120', date: '2026-04-04', amount: 290, category: 'Food', type: 'expense', note: 'Groceries and household items' },
  { id: 'TXN-121', date: '2026-04-05', amount: 5200, category: 'Freelance', type: 'income', note: 'Dashboard implementation' },
  { id: 'TXN-122', date: '2026-04-05', amount: 410, category: 'Utilities', type: 'expense', note: 'Electricity and internet bill' },
  { id: 'TXN-123', date: '2026-04-05', amount: 220, category: 'Transport', type: 'expense', note: 'Fuel refill and parking' },
  { id: 'TXN-124', date: '2026-04-05', amount: 3400, category: 'Investments', type: 'income', note: 'ETF partial redemption' },
]
