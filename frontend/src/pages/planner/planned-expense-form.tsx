import { useState, type FormEvent } from "react"
import { Plus } from "lucide-react"

import type { Category } from "@/lib/categories"
import type { PlannedExpense } from "@/lib/planner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const NO_CATEGORY = "none"

type Props = {
  categories: Category[]
  onAdd: (item: Omit<PlannedExpense, "id">) => void
}

export function PlannedExpenseForm({ categories, onAdd }: Props) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [categoryId, setCategoryId] = useState(NO_CATEGORY)

  const parsedAmount = Number(amount)
  const isValid = name.trim() !== "" && parsedAmount > 0

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isValid) return
    onAdd({
      name: name.trim(),
      amount: parsedAmount,
      categoryId: categoryId === NO_CATEGORY ? null : Number(categoryId),
    })
    setName("")
    setAmount("")
  }

  return (
    <form
      className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_8rem_12rem_auto] sm:items-end"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="planned-name">Expense</Label>
        <Input
          id="planned-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New laptop"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="planned-amount">Amount</Label>
        <Input
          id="planned-amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1200"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="planned-category">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger id="planned-category" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_CATEGORY}>No category</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={!isValid}>
        <Plus data-icon="inline-start" />
        Add
      </Button>
    </form>
  )
}
