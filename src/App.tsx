import { useEffect } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { useFinance } from './context/useFinance'

function App() {
  const bootstrap = useFinance((state) => state.bootstrap)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  return (
    <AppLayout />
  )
}

export default App
