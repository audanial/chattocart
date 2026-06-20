"use client";

import { useMemo } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { EmptyState } from "@/components/EmptyState";
import { PastePanel } from "@/components/PastePanel";
import { SummaryCards } from "@/components/SummaryCards";
import { OrdersTable } from "@/components/OrdersTable";
import { TopItemsChart } from "@/components/TopItemsChart";
import { ParseWarnings } from "@/components/ParseWarnings";
import { useOrders } from "@/hooks/useOrders";
import { computeSummary, topItems } from "@/lib/derive";
import { SAMPLE_CHAT } from "@/lib/sampleData";

export default function Home() {
  const { orders, summary, persistedChatText, loading, error, parse, updateStatus } = useOrders();

  const derivedSummary = useMemo(() => computeSummary(orders), [orders]);
  const chartItems = useMemo(() => topItems(orders, 5), [orders]);

  const mainContent =
    orders.length === 0 ? (
      <EmptyState />
    ) : (
      <div className="space-y-6">
        <SummaryCards summary={derivedSummary} />
        <ParseWarnings warnings={summary.parse_warnings ?? []} />
        <OrdersTable orders={orders} onStatusChange={updateStatus} />
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
