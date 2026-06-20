"use client";

import { useState, useEffect } from "react";
import type { Order, ParseSummary, Status } from "@/lib/types";
import { SAMPLE_RESULT } from "@/lib/sampleData";
import { loadOrders, saveOrders } from "@/lib/storage";

export interface UseOrdersReturn {
  orders: Order[];
  summary: ParseSummary;
  persistedChatText: string | null;
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
  const [persistedChatText, setPersistedChatText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from localStorage after mount — runs client-only, avoids SSR mismatch.
  useEffect(() => {
    const stored = loadOrders();
    if (stored) {
      setOrders(stored.orders);
      setSummary(stored.summary);
      setPersistedChatText(stored.chatText ?? null);
    }
  }, []);

  async function parse(chatText: string): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatText }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error ${res.status}`);
      }
      const result = await res.json();
      setOrders(result.orders);
      setSummary(result.summary);
      saveOrders({ orders: result.orders, summary: result.summary }, chatText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Parse failed");
    } finally {
      setLoading(false);
    }
  }

  function updateStatus(orderId: string, status: Status): void {
    setOrders((prev) => {
      const next = prev.map((o) => (o.order_id === orderId ? { ...o, status } : o));
      saveOrders({ orders: next, summary }, persistedChatText ?? "");
      return next;
    });
  }

  // Stub — wired in Phase 8
  function reset(): void {
    void setSummary;
  }

  // Stub — wired in Phase 8
  function loadDemo(): void {
    void setSummary;
  }

  return { orders, summary, persistedChatText, loading, error, parse, updateStatus, reset, loadDemo };
}
