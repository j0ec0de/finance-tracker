import {
  ArrowLeftRight,
  LayoutDashboard,
  LineChart,
  PiggyBank,
  Tags,
  Target,
  Wallet,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  title: string
  url: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Transactions", url: "/transactions", icon: ArrowLeftRight },
  { title: "Accounts", url: "/accounts", icon: Wallet },
  { title: "Categories", url: "/categories", icon: Tags },
  { title: "Budgets", url: "/budgets", icon: PiggyBank },
  { title: "Goals", url: "/goals", icon: Target },
  { title: "Analytics", url: "/analytics", icon: LineChart },
]
