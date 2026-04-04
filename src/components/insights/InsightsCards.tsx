import { motion } from 'framer-motion'

type InsightsCardsProps = {
  insights: {
    highestCategory: string
    monthlyComparison: string
    observation: string
  }
}

export function InsightsCards({ insights }: InsightsCardsProps) {
  const cards = [
    { title: 'Highest Spending Category', value: insights.highestCategory },
    { title: 'Monthly Comparison', value: insights.monthlyComparison },
    { title: 'Observation', value: insights.observation },
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
          transition: { staggerChildren: 0.09 },
        },
      }}
    >
      {cards.map((item) => (
        <motion.article
          key={item.title}
          className="rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] p-5"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          transition={{ type: 'spring', stiffness: 105, damping: 15 }}
          whileHover={{ y: -4, scale: 1.01 }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-dim)]">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-main)]">{item.value}</p>
        </motion.article>
      ))}
    </motion.section>
  )
}
