import { useState } from "react"

import type { PlannedExpense } from "@/lib/planner"

/** What-if expenses live in memory only; nothing is sent to the API. */
export function usePlannedExpenses() {
  const [items, setItems] = useState<PlannedExpense[]>([])

  const add = (item: Omit<PlannedExpense, "id">) =>
    setItems((current) => [...current, { ...item, id: crypto.randomUUID() }])
  const remove = (id: string) =>
    setItems((current) => current.filter((item) => item.id !== id))
  const clear = () => setItems([])

  return { items, add, remove, clear }
}
