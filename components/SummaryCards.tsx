import { ShoppingCart, CircleDollarSign, Clock, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DerivedSummary } from "@/lib/derive";

interface Props {
  summary: DerivedSummary;
}

const CARDS = [
  {
    key: "total_orders" as const,
    label: "Orders today",
    icon: ShoppingCart,
    format: (v: number) => v.toString(),
  },
  {
    key: "total_revenue" as const,
    label: "Revenue",
    icon: CircleDollarSign,
    format: (v: number) => `RM ${v.toFixed(2)}`,
  },
  {
    key: "pending_count" as const,
    label: "Pending",
    icon: Clock,
    format: (v: number) => v.toString(),
  },
  {
    key: "flagged_count" as const,
    label: "Needs review",
    icon: AlertTriangle,
    format: (v: number) => v.toString(),
  },
] satisfies {
  key: keyof DerivedSummary;
  label: string;
  icon: React.ElementType;
  format: (v: number) => string;
}[];

export function SummaryCards({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CARDS.map(({ key, label, icon: Icon, format }) => (
        <Card key={key} size="sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">
              {format(summary[key])}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
