import { ShoppingCart, CircleDollarSign, Clock, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DerivedSummary } from "@/lib/derive";

export type ActiveFilter = "pending" | "needs_review" | null;

interface Props {
  summary: DerivedSummary;
  activeFilter?: ActiveFilter;
  onFilterToggle?: (filter: "pending" | "needs_review") => void;
}

const CARDS: {
  key: keyof DerivedSummary;
  label: string;
  icon: React.ElementType;
  format: (v: number) => string;
  filter?: "pending" | "needs_review";
}[] = [
  {
    key: "total_orders",
    label: "Orders today",
    icon: ShoppingCart,
    format: (v) => v.toString(),
  },
  {
    key: "total_revenue",
    label: "Revenue",
    icon: CircleDollarSign,
    format: (v) => `RM ${v.toFixed(2)}`,
  },
  {
    key: "pending_count",
    label: "Pending",
    icon: Clock,
    format: (v) => v.toString(),
    filter: "pending",
  },
  {
    key: "flagged_count",
    label: "Needs review",
    icon: AlertTriangle,
    format: (v) => v.toString(),
    filter: "needs_review",
  },
];

export function SummaryCards({ summary, activeFilter, onFilterToggle }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CARDS.map(({ key, label, icon: Icon, format, filter }) => {
        const isActive = filter != null && activeFilter === filter;
        const isFilterable = filter != null;
        return (
          <Card
            key={key}
            size="sm"
            onClick={isFilterable ? () => onFilterToggle?.(filter) : undefined}
            className={isFilterable ? "cursor-pointer transition-shadow" : undefined}
            style={isActive ? { outline: "2px solid var(--brand-green)", outlineOffset: "2px" } : undefined}
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: isActive ? "var(--brand-green)" : undefined }}
                >
                  {label}
                </CardTitle>
                <Icon
                  className="h-4 w-4 shrink-0"
                  style={{ color: isActive ? "var(--brand-green)" : undefined }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-semibold tabular-nums"
                style={
                  key === "total_revenue"
                    ? { color: "var(--brand-terracotta)" }
                    : isActive
                    ? { color: "var(--brand-green)" }
                    : undefined
                }
              >
                {format(summary[key])}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
