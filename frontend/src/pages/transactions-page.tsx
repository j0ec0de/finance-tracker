import { useState } from "react"
import { ArrowLeftRight, Pencil, Plus, Trash2 } from "lucide-react"

import { useAccounts } from "@/hooks/use-accounts"
import { useCategories } from "@/hooks/use-categories"
import { useCreateTransactionForm } from "@/hooks/use-create-transaction-form"
import { useEditTransactionForm } from "@/hooks/use-edit-transaction-form"
import { useDeleteTransaction, useTransactions } from "@/hooks/use-transactions"
import type { Account } from "@/lib/accounts"
import { ApiError } from "@/lib/api"
import type { Category } from "@/lib/categories"
import { formatCurrency } from "@/lib/format"
import type { Transaction, TransactionType } from "@/lib/transactions"
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

const PAGE_SIZE = 20

const typeLabels: Record<TransactionType, string> = {
  expense: "Expense",
  income: "Income",
}

function AccountCategoryFields({
  accounts,
  categories,
  accountId,
  setAccountId,
  categoryId,
  setCategoryId,
  type,
}: {
  accounts: Account[]
  categories: Category[]
  accountId: string
  setAccountId: (v: string) => void
  categoryId: string
  setCategoryId: (v: string) => void
  type: TransactionType
}) {
  const matchingCategories = categories.filter((c) => c.type === type)

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="transaction-account">Account</Label>
        <Select value={accountId} onValueChange={setAccountId}>
          <SelectTrigger id="transaction-account" className="w-full">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={String(account.id)}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="transaction-category">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger id="transaction-category" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No category</SelectItem>
            {matchingCategories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function AddTransactionDialog({
  accounts,
  categories,
}: {
  accounts: Account[]
  categories: Category[]
}) {
  const [open, setOpen] = useState(false)
  const {
    accountId,
    setAccountId,
    categoryId,
    setCategoryId,
    type,
    setType,
    amount,
    setAmount,
    description,
    setDescription,
    occurredAt,
    setOccurredAt,
    error,
    isSubmitting,
    handleSubmit,
  } = useCreateTransactionForm(accounts[0]?.id, () => setOpen(false))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={accounts.length === 0}>
          <Plus data-icon="inline-start" />
          Add transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
          <DialogDescription>
            Record an expense or income and keep its account balance in sync.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="transaction-type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
              <SelectTrigger id="transaction-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AccountCategoryFields
            accounts={accounts}
            categories={categories}
            accountId={accountId}
            setAccountId={setAccountId}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            type={type}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="transaction-amount">Amount</Label>
              <Input
                id="transaction-amount"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="transaction-date">Date</Label>
              <Input
                id="transaction-date"
                type="date"
                required
                value={occurredAt}
                onChange={(e) => setOccurredAt(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="transaction-description">Description</Label>
            <Input
              id="transaction-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditTransactionDialog({
  transaction,
  accounts,
  categories,
  open,
  onOpenChange,
}: {
  transaction: Transaction
  accounts: Account[]
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const {
    accountId,
    setAccountId,
    categoryId,
    setCategoryId,
    type,
    setType,
    amount,
    setAmount,
    description,
    setDescription,
    occurredAt,
    setOccurredAt,
    error,
    isSubmitting,
    handleSubmit,
  } = useEditTransactionForm(transaction, () => onOpenChange(false))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
          <DialogDescription>
            Changing the account or amount keeps balances in sync automatically.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-transaction-type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
              <SelectTrigger id="edit-transaction-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AccountCategoryFields
            accounts={accounts}
            categories={categories}
            accountId={accountId}
            setAccountId={setAccountId}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            type={type}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-transaction-amount">Amount</Label>
              <Input
                id="edit-transaction-amount"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-transaction-date">Date</Label>
              <Input
                id="edit-transaction-date"
                type="date"
                required
                value={occurredAt}
                onChange={(e) => setOccurredAt(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-transaction-description">Description</Label>
            <Input
              id="edit-transaction-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
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

export default function TransactionsPage() {
  const [offset, setOffset] = useState(0)
  const [accountFilter, setAccountFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const { data: accounts, isLoading: accountsLoading } = useAccounts()
  const { data: categories } = useCategories()

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useTransactions({
    limit: PAGE_SIZE,
    offset,
    accountId: accountFilter === "all" ? undefined : Number(accountFilter),
    type: typeFilter === "all" ? undefined : (typeFilter as TransactionType),
  })

  const deleteTransaction = useDeleteTransaction()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const accountsById = new Map((accounts ?? []).map((a) => [a.id, a]))
  const categoriesById = new Map((categories ?? []).map((c) => [c.id, c]))

  const hasFilters = accountFilter !== "all" || typeFilter !== "all"
  const total = result?.total ?? 0
  const rangeStart = total === 0 ? 0 : offset + 1
  const rangeEnd = Math.min(offset + PAGE_SIZE, total)

  function updateAccountFilter(value: string) {
    setAccountFilter(value)
    setOffset(0)
  }

  function updateTypeFilter(value: string) {
    setTypeFilter(value)
    setOffset(0)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <CardTitle>Transactions</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={accountFilter} onValueChange={updateAccountFilter}>
              <SelectTrigger className="w-40" aria-label="Filter by account">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All accounts</SelectItem>
                {(accounts ?? []).map((account) => (
                  <SelectItem key={account.id} value={String(account.id)}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            {!accountsLoading && (
              <AddTransactionDialog
                accounts={accounts ?? []}
                categories={categories ?? []}
              />
            )}
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
                : "Couldn't load transactions. Please try again."}
            </p>
          ) : result && result.data.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-0" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.data.map((transaction) => {
                    const account = accountsById.get(transaction.accountId)
                    const category = transaction.categoryId
                      ? categoriesById.get(transaction.categoryId)
                      : undefined

                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.occurredAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.description || (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>{account?.name ?? "—"}</TableCell>
                        <TableCell>
                          {category ? (
                            <Badge variant="secondary">{category.name}</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.type === "income" ? "default" : "secondary"
                            }
                          >
                            {typeLabels[transaction.type]}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={
                            "text-right " +
                            (transaction.type === "income"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "")
                          }
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(Number(transaction.amount), account?.currency)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Edit transaction"
                              onClick={() => setEditingTransaction(transaction)}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Delete transaction"
                              disabled={deleteTransaction.isPending}
                              onClick={() => deleteTransaction.mutate(transaction.id)}
                            >
                              <Trash2 className="text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  {rangeStart}–{rangeEnd} of {total}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={offset === 0}
                    onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={offset + PAGE_SIZE >= total}
                    onClick={() => setOffset(offset + PAGE_SIZE)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <PagePlaceholder
              icon={ArrowLeftRight}
              title={hasFilters ? "No matching transactions" : "No transactions yet"}
              description={
                hasFilters
                  ? "Try a different account or type filter."
                  : accounts && accounts.length === 0
                    ? "Add an account first, then record your first transaction."
                    : "Record your first expense or income to start tracking."
              }
            />
          )}
        </CardContent>
      </Card>

      {editingTransaction && (
        <EditTransactionDialog
          transaction={editingTransaction}
          accounts={accounts ?? []}
          categories={categories ?? []}
          open
          onOpenChange={(open) => !open && setEditingTransaction(null)}
        />
      )}
    </div>
  )
}
