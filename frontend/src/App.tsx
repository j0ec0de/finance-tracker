import { Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/layout/app-layout"
import { ProtectedRoute } from "@/components/layout/protected-route"
import AccountsPage from "@/pages/accounts-page"
import AnalyticsPage from "@/pages/analytics-page"
import BudgetsPage from "@/pages/budgets-page"
import CategoriesPage from "@/pages/categories-page"
import DashboardPage from "@/pages/dashboard-page"
import LoginPage from "@/pages/login-page"
import RegisterPage from "@/pages/register-page"
import TransactionsPage from "@/pages/transactions-page"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
