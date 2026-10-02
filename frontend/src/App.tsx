import { Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/layout/app-layout"
import AccountsPage from "@/pages/accounts-page"
import AnalyticsPage from "@/pages/analytics-page"
import BudgetsPage from "@/pages/budgets-page"
import DashboardPage from "@/pages/dashboard-page"
import TransactionsPage from "@/pages/transactions-page"

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="budgets" element={<BudgetsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
    </Routes>
  )
}

export default App
