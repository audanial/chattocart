import type { ParseResult } from "@/lib/types";

const KEY = "chattocart_result";

interface StoredData extends ParseResult {
  chatText: string;
}

export function loadOrders(): StoredData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredData;
  } catch {
    return null;
  }
}

export function saveOrders(result: ParseResult, chatText: string): void {
  if (typeof window === "undefined") return;
  try {
    const data: StoredData = { ...result, chatText };
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // ignore quota or private-mode errors
  }
}
