import { motion } from 'framer-motion'
import { useFinance } from '../context/FinanceContext'
import { BalanceTrendChart } from '../components/dashboard/BalanceTrendChart'
import { SpendingPieChart } from '../components/dashboard/SpendingPieChart'
import { SummaryCards } from '../components/dashboard/SummaryCards'
import { LoadingPanel } from '../components/common/LoadingPanel'

export function OverviewPage() {
  const { loading, summary, trendData, spendingBreakdown } = useFinance()

  if (loading) {
    return <LoadingPanel />
  }

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.12, duration: 0.45, ease: 'easeOut' },
        },
      }}
    >
      <SummaryCards
        totalBalance={summary.totalBalance}
        totalIncome={summary.totalIncome}
        totalExpenses={summary.totalExpenses}
      />
      <motion.section className="grid gap-4 lg:grid-cols-2" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
        <BalanceTrendChart data={trendData} />
        <SpendingPieChart data={spendingBreakdown} />
      </motion.section>
    </motion.div>
  )
}
