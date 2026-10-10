// Budgets and savings goals have no backend model yet (see backend/docs/upcoming-features.md),
// so SpendingLimitCard and GoalTrackerCard still render this mock data.

export const monthlySpendingLimit = {
  spent: 8600,
  limit: 10000,
}

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
