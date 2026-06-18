"use client";

import { useState } from "react";
import type { Order, ParseSummary, Status } from "@/lib/types";
import { SAMPLE_RESULT } from "@/lib/sampleData";

export interface UseOrdersReturn {
  orders: Order[];
  summary: ParseSummary;
  loading: boolean;
  error: string | null;
  parse: (chatText: string) => Promise<void>;
  updateStatus: (orderId: string, status: Status) => void;
  reset: () => void;
  loadDemo: () => void;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>(SAMPLE_RESULT.orders);
  const [summary, setSummary] = useState<ParseSummary>(SAMPLE_RESULT.summary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stub — wired in Phase 3
  async function parse(_chatText: string): Promise<void> {
    void _chatText;
    void setLoading;
    void setError;
  }

  // Stub — wired in Phase 4
  function updateStatus(_orderId: string, _status: Status): void {
    void _orderId;
    void _status;
    void setOrders;
  }

  // Stub — wired in Phase 8
  function reset(): void {
    void setSummary;
  }

  // Stub — wired in Phase 8
  function loadDemo(): void {
    void setSummary;
  }

  return { orders, summary, loading, error, parse, updateStatus, reset, loadDemo };
}
