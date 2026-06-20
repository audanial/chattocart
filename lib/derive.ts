import type { Order } from "@/lib/types";

export interface DerivedSummary {
  total_orders: number;
  total_revenue: number;
  pending_count: number;
  flagged_count: number;
}

export function computeSummary(orders: Order[]): DerivedSummary {
  return {
    total_orders: orders.length,
    total_revenue: orders.reduce((sum, o) => sum + (o.order_total ?? 0), 0),
    pending_count: orders.filter((o) => o.status !== "done").length,
    flagged_count: orders.filter((o) => o.needs_review).length,
  };
}

export interface TopItem {
  name: string;
  quantity: number;
}

export function topItems(orders: Order[], limit: number = 5): TopItem[] {
  const tally = new Map<string, number>();
  for (const order of orders) {
    for (const item of order.items) {
      tally.set(item.name, (tally.get(item.name) ?? 0) + item.quantity);
    }
  }
  return [...tally.entries()]
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}
