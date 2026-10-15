import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const RANGE_OPTIONS = [
  { months: 3, label: "Last 3 months" },
  { months: 6, label: "Last 6 months" },
  { months: 12, label: "Last 12 months" },
]

type RangeSelectProps = {
  months: number
  onChange: (months: number) => void
}

export function RangeSelect({ months, onChange }: RangeSelectProps) {
  return (
    <Select
      value={String(months)}
      onValueChange={(value) => onChange(Number(value))}
    >
      <SelectTrigger size="sm" aria-label="Date range">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {RANGE_OPTIONS.map((option) => (
          <SelectItem key={option.months} value={String(option.months)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
