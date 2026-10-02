import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import { costAnalysisTotal, costCategories } from "@/pages/dashboard/mock-data"

export function CostAnalysisCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Cost analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Spending overview</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-2xl font-semibold">
          {formatCurrency(costAnalysisTotal)}
        </p>

        <div
          className="flex h-2.5 w-full overflow-hidden rounded-full"
          role="img"
          aria-label="Spending breakdown by category"
        >
          {costCategories.map((category) => (
            <div
              key={category.name}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${category.pct}%`,
                backgroundColor: category.color,
                marginRight: "2px",
              }}
            />
          ))}
        </div>

        <ul className="space-y-2">
          {costCategories.map((category) => (
            <li
              key={category.name}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: category.color }}
                  aria-hidden
                />
                <span className="text-foreground">{category.name}</span>
              </span>
              <span className="text-muted-foreground">{category.pct}%</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
