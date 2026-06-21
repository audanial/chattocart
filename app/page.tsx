"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { EmptyState } from "@/components/EmptyState";
import { PastePanel } from "@/components/PastePanel";
import { SummaryCards, type ActiveFilter } from "@/components/SummaryCards";
import { OrdersTable } from "@/components/OrdersTable";
import { TopItemsChart } from "@/components/TopItemsChart";
import { ParseWarnings } from "@/components/ParseWarnings";
import { useOrders } from "@/hooks/useOrders";
import { computeSummary, topItems } from "@/lib/derive";
import { SAMPLE_CHAT } from "@/lib/sampleData";

export default function Home() {
  const { orders, summary, persistedChatText, loading, error, parse, updateStatus } = useOrders();
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);

  const allOrdersSummary = useMemo(() => computeSummary(orders), [orders]);
  const chartItems = useMemo(() => topItems(orders, 5), [orders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "pending") return orders.filter((o) => o.status !== "done");
    if (activeFilter === "needs_review") return orders.filter((o) => o.needs_review);
    return orders;
  }, [orders, activeFilter]);

  // Orders today + Revenue reflect the visible filtered set.
  // Pending + Needs review counts always reflect the true totals across all orders
  // (they act as toggle buttons, so showing a filtered count would be confusing).
  const displaySummary = useMemo(() => {
    if (activeFilter === null) return allOrdersSummary;
    const filtered = computeSummary(filteredOrders);
    return {
      ...filtered,
      pending_count: allOrdersSummary.pending_count,
      flagged_count: allOrdersSummary.flagged_count,
    };
  }, [filteredOrders, allOrdersSummary, activeFilter]);

  function handleFilterToggle(filter: "pending" | "needs_review") {
    setActiveFilter((prev) => (prev === filter ? null : filter));
  }

  const mainContent =
    orders.length === 0 ? (
      <EmptyState />
    ) : (
      <div className="space-y-6">
        <SummaryCards
          summary={displaySummary}
          activeFilter={activeFilter}
          onFilterToggle={handleFilterToggle}
        />
        <ParseWarnings warnings={summary.parse_warnings ?? []} />
        <OrdersTable orders={filteredOrders} onStatusChange={updateStatus} />
        <TopItemsChart items={chartItems} />
      </div>
    );

  return (
    <DashboardShell
      leftPanel={
        <PastePanel
          key={persistedChatText !== null ? "hydrated" : "sample"}
          defaultValue={persistedChatText ?? SAMPLE_CHAT}
          onParse={parse}
          loading={loading}
        />
      }
    >
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive mb-4">
          {error}
        </div>
      )}
      {mainContent}
    </DashboardShell>
  );
}
