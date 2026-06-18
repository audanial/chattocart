export type Status = "new" | "preparing" | "done";
export type Fulfillment = "delivery" | "pickup" | "dine_in" | "unknown";

export interface OrderItem {
  name: string;
  quantity: number;
  modifiers: string[];
  unit_price: number | null;
  line_total: number | null;
  notes: string | null;
}

export interface Order {
  order_id: string;
  customer: { name: string | null; phone: string | null; address: string | null };
  items: OrderItem[];
  order_total: number | null;
  currency: "MYR";
  fulfillment: Fulfillment;
  status: Status;
  needs_review: boolean;
  review_reasons: string[];
  confidence: "high" | "medium" | "low";
  raw_excerpt: string;
}

export interface ParseSummary {
  total_orders: number;
  total_revenue: number | null;
  items_flagged_for_review: number;
  parse_warnings: string[];
}

export interface ParseResult {
  orders: Order[];
  summary: ParseSummary;
}
