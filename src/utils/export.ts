import type { Transaction } from '../types/finance'

const download = (filename: string, content: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export const exportTransactionsJSON = (rows: Transaction[]) => {
  download('transactions.json', JSON.stringify(rows, null, 2), 'application/json')
}

export const exportTransactionsCSV = (rows: Transaction[]) => {
  const headers = ['id', 'date', 'amount', 'category', 'type', 'note']
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`
  const body = rows
    .map((row) => [row.id, row.date, row.amount, row.category, row.type, row.note].map(escape).join(','))
    .join('\n')

  download('transactions.csv', `${headers.join(',')}\n${body}`, 'text/csv;charset=utf-8;')
}
