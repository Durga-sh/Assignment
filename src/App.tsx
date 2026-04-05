import { AppLayout } from './components/layout/AppLayout'
import { FinanceProvider } from './context/FinanceContext'

function App() {
  return (
    <FinanceProvider>
      <AppLayout />
    </FinanceProvider>
  )
}

export default App
