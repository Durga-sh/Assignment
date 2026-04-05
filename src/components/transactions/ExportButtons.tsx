import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { Button } from '../ui/Button'

type ExportButtonsProps = {
  onCSV: () => void
  onJSON: () => void
}

export function ExportButtons({ onCSV, onJSON }: ExportButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.div whileHover={{ y: -1, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button onClick={onCSV} variant="secondary" className="px-3">
          <Download size={14} /> CSV
        </Button>
      </motion.div>
      <motion.div whileHover={{ y: -1, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button onClick={onJSON} variant="secondary" className="px-3">
          <Download size={14} /> JSON
        </Button>
      </motion.div>
    </div>
  )
}
