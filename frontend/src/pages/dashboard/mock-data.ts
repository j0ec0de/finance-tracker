export type DailyFlow = {
  day: string
  income: number
  expenses: number
  savings: number
}

export const weeklyFlow: DailyFlow[] = [
  { day: "Sun", income: 120, expenses: 60, savings: 0 },
  { day: "Mon", income: 180, expenses: 90, savings: 0 },
  { day: "Tue", income: 90, expenses: 140, savings: 0 },
  { day: "Wed", income: 700, expenses: 460, savings: 240 },
  { day: "Thu", income: 60, expenses: 180, savings: 0 },
  { day: "Fri", income: 210, expenses: 95, savings: 0 },
  { day: "Sat", income: 40, expenses: 70, savings: 0 },
]

export const summaryStats = {
  totalIncome: { value: 15000, deltaPct: 5.1 },
  totalExpenses: { value: 6700, deltaPct: 15.5 },
  savedBalance: { value: 8300, deltaPct: 20.7 },
}

export const monthlySpendingLimit = {
  spent: 8600,
  limit: 10000,
}

export const financialHealth = {
  percentSaved: 75,
  value: 15780,
  deltaPct: 17.5,
}

export type CostCategory = {
  name: string
  amount: number
  pct: number
  color: string
}

export const costCategories: CostCategory[] = [
  { name: "Housing", amount: 1521, pct: 18, color: "var(--chart-1)" },
  { name: "Debt payments", amount: 592, pct: 7, color: "var(--chart-2)" },
  { name: "Food", amount: 507, pct: 6, color: "var(--chart-3)" },
  { name: "Transportation", amount: 761, pct: 9, color: "var(--chart-4)" },
  { name: "Healthcare", amount: 845, pct: 10, color: "var(--chart-5)" },
  { name: "Other", amount: 2224, pct: 50, color: "var(--muted-foreground)" },
]

export const costAnalysisTotal = 8450

export type Goal = {
  name: string
  saved: number
  target: number
  eta: string
}

export const goals: Goal[] = [
  { name: "Reserve", saved: 7000, target: 10000, eta: "4 months" },
  { name: "Travel", saved: 2500, target: 4000, eta: "3 months" },
  { name: "New car", saved: 1600, target: 20000, eta: "3 years 6 months" },
]

export type Transaction = {
  id: string
  name: string
  date: string
  amount: number
  status: "completed" | "declined"
}

export const recentTransactions: Transaction[] = [
  { id: "t1", name: "Paycheck", date: "Feb 25, 2026", amount: 2100, status: "completed" },
  { id: "t2", name: "Rent", date: "Feb 25, 2026", amount: -1500, status: "completed" },
  { id: "t3", name: "Credit card payment", date: "Feb 24, 2026", amount: -640, status: "declined" },
  { id: "t4", name: "Groceries - Trader Joe's", date: "Feb 23, 2026", amount: -118, status: "completed" },
  { id: "t5", name: "Freelance invoice", date: "Feb 21, 2026", amount: 600, status: "completed" },
  { id: "t6", name: "Electric bill", date: "Feb 20, 2026", amount: -92, status: "completed" },
]
