import { useState } from "react"
import { Pencil, PiggyBank, Plus, Trash2 } from "lucide-react"

import { useCategories } from "@/hooks/use-categories"
import { useBudgets, useDeleteBudget } from "@/hooks/use-budgets"
import { useCreateBudgetForm } from "@/hooks/use-create-budget-form"
import { useEditBudgetForm } from "@/hooks/use-edit-budget-form"
import { ApiError } from "@/lib/api"
import type { Budget, BudgetPeriod } from "@/lib/budgets"
import { useFormatCurrency } from "@/hooks/use-display-currency"
import { PagePlaceholder } from "@/components/layout/page-placeholder"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Meter } from "@/pages/dashboard/meter"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const periodLabels: Record<BudgetPeriod, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
}

function AddBudgetDialog({ categories }: { categories: { id: number; name: string }[] }) {
  const [open, setOpen] = useState(false)
  const {
    categoryId,
    setCategoryId,
    limit,
    setLimit,
    period,
    setPeriod,
    error,
    isSubmitting,
    handleSubmit,
  } = useCreateBudgetForm(() => setOpen(false))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={categories.length === 0}>
          <Plus data-icon="inline-start" />
          Add budget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add budget</DialogTitle>
          <DialogDescription>
            Set a spending limit for a category each period.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="budget-category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="budget-category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="budget-limit">Limit</Label>
            <Input
              id="budget-limit"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="200"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="budget-period">Period</Label>
            <Select value={period} onValueChange={(v) => setPeriod(v as BudgetPeriod)}>
              <SelectTrigger id="budget-period" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditBudgetDialog({
  budget,
  open,
  onOpenChange,
}: {
  budget: Budget
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { limit, setLimit, period, setPeriod, error, isSubmitting, handleSubmit } =
    useEditBudgetForm(budget, () => onOpenChange(false))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit budget</DialogTitle>
          <DialogDescription>Update the limit or period.</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-budget-limit">Limit</Label>
            <Input
              id="edit-budget-limit"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-budget-period">Period</Label>
            <Select value={period} onValueChange={(v) => setPeriod(v as BudgetPeriod)}>
              <SelectTrigger id="edit-budget-period" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function BudgetsPage() {
  const formatCurrency = useFormatCurrency()
  const { data: budgets, isLoading, isError, error } = useBudgets()
  const { data: categories } = useCategories()
  const deleteBudget = useDeleteBudget()
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)

  const categoryNameById = new Map((categories ?? []).map((c) => [c.id, c.name]))
  const expenseCategories = (categories ?? []).filter((c) => c.type === "expense")
  const budgetedCategoryIds = new Set((budgets ?? []).map((b) => b.categoryId))
  const availableCategories = expenseCategories.filter(
    (c) => !budgetedCategoryIds.has(c.id)
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <CardTitle>Budgets</CardTitle>
          <AddBudgetDialog categories={availableCategories} />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : isError ? (
            <p className="py-8 text-center text-sm text-destructive">
              {error instanceof ApiError
                ? error.message
                : "Couldn't load budgets. Please try again."}
            </p>
          ) : (budgets ?? []).length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {budgets!.map((budget) => {
                const limit = Number(budget.limit)
                const overBudget = budget.remaining < 0
                return (
                  <div
                    key={budget.id}
                    className="flex flex-col gap-3 rounded-lg border p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">
                          {categoryNameById.get(budget.categoryId) ?? "Unknown category"}
                        </p>
                        <Badge variant="secondary">{periodLabels[budget.period]}</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Edit budget"
                          onClick={() => setEditingBudget(budget)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Delete budget"
                          disabled={deleteBudget.isPending}
                          onClick={() => deleteBudget.mutate(budget.id)}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <Meter value={budget.spent} max={limit} />
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={overBudget ? "font-medium text-destructive" : "font-medium"}
                      >
                        {formatCurrency(budget.spent)}
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(limit)}
                      </span>
                    </div>
                    {overBudget && (
                      <p className="text-sm text-destructive">
                        {formatCurrency(-budget.remaining)} over budget
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <PagePlaceholder
              icon={PiggyBank}
              title="No budgets yet"
              description="Set a spending limit per category to track progress here."
            />
          )}
        </CardContent>
      </Card>

      {editingBudget && (
        <EditBudgetDialog
          budget={editingBudget}
          open
          onOpenChange={(open) => !open && setEditingBudget(null)}
        />
      )}
    </div>
  )
}
