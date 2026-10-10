import { useState } from "react"
import { Pencil, Plus, Tags, Trash2 } from "lucide-react"

import {
  useCategories,
  useDeleteCategory,
} from "@/hooks/use-categories"
import { useCreateCategoryForm } from "@/hooks/use-create-category-form"
import { useEditCategoryForm } from "@/hooks/use-edit-category-form"
import { ApiError } from "@/lib/api"
import type { Category, CategoryType } from "@/lib/categories"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const categoryTypeLabels: Record<CategoryType, string> = {
  expense: "Expense",
  income: "Income",
}

const PAGE_SIZE = 10

function AddCategoryDialog() {
  const [open, setOpen] = useState(false)
  const { name, setName, type, setType, error, isSubmitting, handleSubmit } =
    useCreateCategoryForm(() => setOpen(false))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus data-icon="inline-start" />
          Add category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>
          <DialogDescription>
            Create a category to organize expenses or income.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Groceries"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category-type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as CategoryType)}>
              <SelectTrigger id="category-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditCategoryDialog({
  category,
  open,
  onOpenChange,
}: {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { name, setName, type, setType, error, isSubmitting, handleSubmit } =
    useEditCategoryForm(category, () => onOpenChange(false))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
          <DialogDescription>Update the name or type.</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-category-name">Name</Label>
            <Input
              id="edit-category-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-category-type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as CategoryType)}>
              <SelectTrigger id="edit-category-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
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

export default function CategoriesPage() {
  const { data: categories, isLoading, isError, error } = useCategories()
  const deleteCategory = useDeleteCategory()
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [typeFilter, setTypeFilter] = useState("all")
  const [page, setPage] = useState(0)

  const filteredCategories = (categories ?? []).filter(
    (category) => typeFilter === "all" || category.type === typeFilter
  )
  const total = filteredCategories.length
  const maxPage = Math.max(0, Math.ceil(total / PAGE_SIZE) - 1)
  const currentPage = Math.min(page, maxPage)
  const pageStart = currentPage * PAGE_SIZE
  const visibleCategories = filteredCategories.slice(pageStart, pageStart + PAGE_SIZE)
  const rangeStart = total === 0 ? 0 : pageStart + 1
  const rangeEnd = Math.min(pageStart + PAGE_SIZE, total)

  function updateTypeFilter(value: string) {
    setTypeFilter(value)
    setPage(0)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <CardTitle>Categories</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={updateTypeFilter}>
              <SelectTrigger className="w-32" aria-label="Filter by type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
            <AddCategoryDialog />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : isError ? (
            <p className="py-8 text-center text-sm text-destructive">
              {error instanceof ApiError
                ? error.message
                : "Couldn't load categories. Please try again."}
            </p>
          ) : total > 0 ? (
            <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-0" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={category.type === "income" ? "default" : "secondary"}
                      >
                        {categoryTypeLabels[category.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${category.name}`}
                          onClick={() => setEditingCategory(category)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete ${category.name}`}
                          disabled={deleteCategory.isPending}
                          onClick={() => deleteCategory.mutate(category.id)}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {total > PAGE_SIZE && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  {rangeStart}–{rangeEnd} of {total}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pageStart + PAGE_SIZE >= total}
                    onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
            </>
          ) : (
            <PagePlaceholder
              icon={Tags}
              title={
                typeFilter === "all" ? "No categories yet" : "No matching categories"
              }
              description={
                typeFilter === "all"
                  ? "Add a category to organize your expenses and income."
                  : "Try a different type filter."
              }
            />
          )}
        </CardContent>
      </Card>

      {editingCategory && (
        <EditCategoryDialog
          category={editingCategory}
          open
          onOpenChange={(open) => !open && setEditingCategory(null)}
        />
      )}
    </div>
  )
}
