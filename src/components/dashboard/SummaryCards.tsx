import { motion } from 'framer-motion'
import { formatCurrency } from '../../utils/format'

type SummaryCardsProps = {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
}

export function SummaryCards({ totalBalance, totalIncome, totalExpenses }: SummaryCardsProps) {
  const cards = [
    { title: 'Total Balance', value: totalBalance, tone: 'text-[var(--text-main)]' },
    { title: 'Income', value: totalIncome, tone: 'text-emerald-400' },
    { title: 'Expenses', value: totalExpenses, tone: 'text-red-400' },
  ]

  return (
    <motion.section
      className="grid gap-4 md:grid-cols-3"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.08 },
        },
      }}
    >
      {cards.map((card, index) => (
        <motion.article
          key={card.title}
          className="rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          transition={{ type: 'spring', stiffness: 110, damping: 16, delay: index * 0.04 }}
          whileHover={{ y: -4, scale: 1.01 }}
        >
          <p className="text-sm text-[var(--text-dim)]">{card.title}</p>
          <p className={`mt-2 text-2xl font-extrabold ${card.tone}`}>{formatCurrency(card.value)}</p>
        </motion.article>
      ))}
    </motion.section>
  )
}
