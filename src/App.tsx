import { AppLayout } from './components/layout/AppLayout'
import { FinanceProvider } from './context/FinanceContext'
import { InsightsPage } from './pages/InsightsPage'
import { OverviewPage } from './pages/OverviewPage'
import { TransactionsPage } from './pages/TransactionsPage'

function App() {
  return (
    <FinanceProvider>
      <AppLayout>
        <div className="space-y-8">
          <section id="overview" className="scroll-mt-28">
            <OverviewPage />
          </section>
          <section id="transactions" className="scroll-mt-28">
            <TransactionsPage />
          </section>
          <section id="insights" className="scroll-mt-28">
            <InsightsPage />
          </section>
        </div>
      </AppLayout>
    </FinanceProvider>
  )
}

export default App
