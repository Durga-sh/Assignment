import { useFinanceStore, type FinanceStore } from '../store/finance-store'

export const useFinance = <T>(selector: (state: FinanceStore) => T) => useFinanceStore(selector)
