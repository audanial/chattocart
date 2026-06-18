"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { EmptyState } from "@/components/EmptyState";
import { PastePanel } from "@/components/PastePanel";
import { useOrders } from "@/hooks/useOrders";
import { SAMPLE_CHAT } from "@/lib/sampleData";

export default function Home() {
  const { orders, summary } = useOrders();

  const mainContent =
    orders.length === 0 ? (
      <EmptyState />
    ) : (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {summary.total_orders} orders · RM {summary.total_revenue?.toFixed(2) ?? "—"} total ·{" "}
          {summary.items_flagged_for_review} flagged
        </div>
        <ul className="space-y-3">
          {orders.map((order) => (
            <li
              key={order.order_id}
              className="rounded-lg border border-border bg-card p-4 text-sm space-y-1"
            >
              <div className="flex items-center justify-between font-medium">
                <span>{order.customer.name ?? "Unknown"} ({order.order_id})</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {order.fulfillment} · {order.status}
                  {order.needs_review && " · ⚠ review"}
                </span>
              </div>
              <ul className="text-muted-foreground space-y-0.5">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.quantity}× {item.name}
                    {item.modifiers.length > 0 && ` [${item.modifiers.join(", ")}]`}
                    {item.line_total != null
                      ? ` — RM ${item.line_total.toFixed(2)}`
                      : " — RM —"}
                  </li>
                ))}
              </ul>
              {order.review_reasons.length > 0 && (
                <div className="text-xs text-destructive">
                  {order.review_reasons.join(" · ")}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <DashboardShell leftPanel={<PastePanel defaultValue={SAMPLE_CHAT} />}>
      {mainContent}
    </DashboardShell>
  );
}
