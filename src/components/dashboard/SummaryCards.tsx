import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { formatCurrency } from '../../utils/format'
import { Card } from '../ui/Card'

type SummaryCardsProps = {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
}

export function SummaryCards({ totalBalance, totalIncome, totalExpenses }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Net Balance',
      value: totalBalance,
      icon: <Wallet size={18} />,
      iconBg: 'bg-[color-mix(in_srgb,var(--accent)_15%,transparent)]',
      iconColor: 'text-[var(--accent)]',
      valueColor: 'text-[var(--text-main)]',
      trend: null,
    },
    {
      title: 'Total Income',
      value: totalIncome,
      icon: <TrendingUp size={18} />,
      iconBg: 'bg-[color-mix(in_srgb,#22d47a_15%,transparent)]',
      iconColor: 'text-emerald-400',
      valueColor: 'text-emerald-400',
      trend: '+',
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: <TrendingDown size={18} />,
      iconBg: 'bg-[color-mix(in_srgb,#ff6b6b_15%,transparent)]',
      iconColor: 'text-red-400',
      valueColor: 'text-red-400',
      trend: '-',
    },
  ]

  return (
    <motion.section
      className="grid gap-4 md:grid-cols-3"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          transition={{ type: 'spring', stiffness: 120, damping: 16, delay: index * 0.04 }}
          whileHover={{ y: -3, boxShadow: '0 8px 30px color-mix(in srgb, var(--accent) 12%, transparent)' }}
        >
          <Card elevated={false} className="group relative overflow-hidden shadow-sm">
            <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[color-mix(in_srgb,var(--accent)_6%,transparent)] blur-2xl" />

            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-[var(--text-dim)]">{card.title}</p>
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
              </span>
            </div>
            <p className={`mt-3 text-2xl font-extrabold tracking-tight ${card.valueColor}`}>
              {card.trend === '-' ? '– ' : ''}{formatCurrency(card.value)}
            </p>
          </Card>
        </motion.div>
      ))}
    </motion.section>
  )
}

