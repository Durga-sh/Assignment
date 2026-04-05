import { motion } from 'framer-motion'
import { Download } from 'lucide-react'

type ExportButtonsProps = {
  onCSV: () => void
  onJSON: () => void
}

export function ExportButtons({ onCSV, onJSON }: ExportButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={onCSV}
        className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--bg-main)] px-3 py-2 text-sm font-semibold text-[var(--text-dim)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        whileHover={{ y: -1, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Download size={14} /> CSV
      </motion.button>
      <motion.button
        onClick={onJSON}
        className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--bg-main)] px-3 py-2 text-sm font-semibold text-[var(--text-dim)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        whileHover={{ y: -1, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Download size={14} /> JSON
      </motion.button>
    </div>
  )
}
