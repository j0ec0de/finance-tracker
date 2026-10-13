import { useState } from "react"
import { Pencil, Plus, Target, Trash2 } from "lucide-react"

import { useDeleteGoal, useGoals } from "@/hooks/use-goals"
import { useCreateGoalForm } from "@/hooks/use-create-goal-form"
import { useEditGoalForm } from "@/hooks/use-edit-goal-form"
import { ApiError } from "@/lib/api"
import type { Goal } from "@/lib/goals"
import { formatCurrency } from "@/lib/format"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Meter } from "@/pages/dashboard/meter"

function formatTargetDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function AddGoalDialog() {
  const [open, setOpen] = useState(false)
  const {
    name,
    setName,
    targetAmount,
    setTargetAmount,
    savedAmount,
    setSavedAmount,
    targetDate,
    setTargetDate,
    error,
    isSubmitting,
    handleSubmit,
  } = useCreateGoalForm(() => setOpen(false))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus data-icon="inline-start" />
          Add goal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add goal</DialogTitle>
          <DialogDescription>
            Set an amount to save towards and track progress against it.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goal-name">Name</Label>
            <Input
              id="goal-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Emergency fund"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goal-target">Target amount</Label>
            <Input
              id="goal-target"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="10000"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goal-saved">Saved so far</Label>
            <Input
              id="goal-saved"
              type="number"
              min="0"
              step="0.01"
              value={savedAmount}
              onChange={(e) => setSavedAmount(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goal-date">Target date</Label>
            <Input
              id="goal-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditGoalDialog({
  goal,
  open,
  onOpenChange,
}: {
  goal: Goal
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const {
    name,
    setName,
    targetAmount,
    setTargetAmount,
    savedAmount,
    setSavedAmount,
    targetDate,
    setTargetDate,
    error,
    isSubmitting,
    handleSubmit,
  } = useEditGoalForm(goal, () => onOpenChange(false))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit goal</DialogTitle>
          <DialogDescription>
            Update the target, or record what you've saved so far.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-goal-name">Name</Label>
            <Input
              id="edit-goal-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-goal-target">Target amount</Label>
            <Input
              id="edit-goal-target"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-goal-saved">Saved so far</Label>
            <Input
              id="edit-goal-saved"
              type="number"
              min="0"
              step="0.01"
              required
              value={savedAmount}
              onChange={(e) => setSavedAmount(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-goal-date">Target date</Label>
            <Input
              id="edit-goal-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
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

export default function GoalsPage() {
  const { data: goals, isLoading, isError, error } = useGoals()
  const deleteGoal = useDeleteGoal()
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <CardTitle>Goals</CardTitle>
          <AddGoalDialog />
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
                : "Couldn't load goals. Please try again."}
            </p>
          ) : (goals ?? []).length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {goals!.map((goal) => {
                const saved = Number(goal.savedAmount)
                const target = Number(goal.targetAmount)
                const remaining = target - saved
                const reached = remaining <= 0
                return (
                  <div
                    key={goal.id}
                    className="flex flex-col gap-3 rounded-lg border p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 space-y-1">
                        <p className="truncate font-medium">{goal.name}</p>
                        {reached ? (
                          <Badge variant="secondary">Reached</Badge>
                        ) : goal.targetDate ? (
                          <Badge variant="secondary">
                            by {formatTargetDate(goal.targetDate)}
                          </Badge>
                        ) : null}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Edit goal"
                          onClick={() => setEditingGoal(goal)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Delete goal"
                          disabled={deleteGoal.isPending}
                          onClick={() => deleteGoal.mutate(goal.id)}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <Meter value={saved} max={target} />
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{formatCurrency(saved)}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(target)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reached
                        ? "Target reached"
                        : `${formatCurrency(remaining)} left to save`}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <PagePlaceholder
              icon={Target}
              title="No goals yet"
              description="Add a savings goal to track how close you are to reaching it."
            />
          )}
        </CardContent>
      </Card>

      {editingGoal && (
        <EditGoalDialog
          goal={editingGoal}
          open
          onOpenChange={(open) => !open && setEditingGoal(null)}
        />
      )}
    </div>
  )
}
