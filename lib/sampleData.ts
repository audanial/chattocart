import type { ParseResult } from "@/lib/types";

export const SAMPLE_CHAT = `[7:15] Ali: nak 1 nachos beef, 1 americano, tapau ye
[7:18] Siti: 1 mini burger set, kurang pedas sos dia
[7:19] Siti: eh tambah jadi 2 mini burger set
[7:19] Siti: dine in
[7:25] Raju: 1 spaghetti bolognese, 1 matcha latte
[7:26] Raju: actually cancel matcha latte, nak butterfly pea lemonade je
[7:27] Raju: hantar No 12 Jalan Melati, Taman Sri Indah
[7:32] Kak Yan: bagi yang biasa tu satu
[7:32] Kak Yan: hantar rumah macam selalu
[7:40] Amir: nak 1 lempeng, 1 mocha
[7:41] Bella: aku nak matcha strawberry latte 2, dine in
[7:42] Amir: tambah 1 nachos chicken`;

export const SAMPLE_RESULT: ParseResult = {
  orders: [
    {
      order_id: "ORD-001",
      customer: { name: "Ali", phone: null, address: null },
      items: [
        { name: "Nachos Beef", quantity: 1, modifiers: [], unit_price: 12.00, line_total: 12.00, notes: null },
        { name: "Americano", quantity: 1, modifiers: [], unit_price: 8.00, line_total: 8.00, notes: null },
      ],
      order_total: 20.00,
      currency: "MYR",
      fulfillment: "pickup",
      status: "new",
      needs_review: false,
      review_reasons: [],
      confidence: "high",
      raw_excerpt: "Ali: nak 1 nachos beef, 1 americano, tapau ye",
    },
    {
      order_id: "ORD-002",
      customer: { name: "Siti", phone: null, address: null },
      items: [
        { name: "Mini Burger Set (4pcs)", quantity: 2, modifiers: ["kurang pedas sos"], unit_price: 16.00, line_total: 32.00, notes: "quantity changed from 1 to 2" },
      ],
      order_total: 32.00,
      currency: "MYR",
      fulfillment: "dine_in",
      status: "new",
      needs_review: false,
      review_reasons: [],
      confidence: "high",
      raw_excerpt: "Siti: 1 mini burger set, kurang pedas sos dia / tambah jadi 2 mini burger set / dine in",
    },
    {
      order_id: "ORD-003",
      customer: { name: "Raju", phone: null, address: "No 12 Jalan Melati, Taman Sri Indah" },
      items: [
        { name: "Spaghetti Bolognese with Meatballs", quantity: 1, modifiers: [], unit_price: 14.00, line_total: 14.00, notes: null },
        { name: "Butterfly Pea Lemonade", quantity: 1, modifiers: [], unit_price: 9.00, line_total: 9.00, notes: "substituted in after cancelling Matcha Latte" },
      ],
      order_total: 23.00,
      currency: "MYR",
      fulfillment: "delivery",
      status: "new",
      needs_review: false,
      review_reasons: [],
      confidence: "high",
      raw_excerpt: "Raju: 1 spaghetti bolognese, 1 matcha latte / cancel matcha latte, nak butterfly pea lemonade je / hantar No 12 Jalan Melati",
    },
    {
      order_id: "ORD-004",
      customer: { name: "Kak Yan", phone: null, address: null },
      items: [
        { name: "UNRESOLVED - 'yang biasa'", quantity: 1, modifiers: [], unit_price: null, line_total: null, notes: "customer referred to 'the usual'" },
      ],
      order_total: null,
      currency: "MYR",
      fulfillment: "delivery",
      status: "new",
      needs_review: true,
      review_reasons: ["ambiguous item: 'yang biasa' (the usual) cannot be resolved", "delivery without address"],
      confidence: "low",
      raw_excerpt: "Kak Yan: bagi yang biasa tu satu / hantar rumah macam selalu",
    },
    {
      order_id: "ORD-005",
      customer: { name: "Amir", phone: null, address: null },
      items: [
        { name: "Lempeng (3pcs)", quantity: 1, modifiers: [], unit_price: 8.00, line_total: 8.00, notes: null },
        { name: "Mocha", quantity: 1, modifiers: [], unit_price: 10.00, line_total: 10.00, notes: null },
        { name: "Nachos Chicken", quantity: 1, modifiers: [], unit_price: 12.00, line_total: 12.00, notes: "added later in chat" },
      ],
      order_total: 30.00,
      currency: "MYR",
      fulfillment: "unknown",
      status: "new",
      needs_review: true,
      review_reasons: ["fulfillment method not stated"],
      confidence: "medium",
      raw_excerpt: "Amir: nak 1 lempeng, 1 mocha / tambah 1 nachos chicken",
    },
    {
      order_id: "ORD-006",
      customer: { name: "Bella", phone: null, address: null },
      items: [
        { name: "Matcha Strawberry Latte", quantity: 2, modifiers: [], unit_price: 12.00, line_total: 24.00, notes: null },
      ],
      order_total: 24.00,
      currency: "MYR",
      fulfillment: "dine_in",
      status: "new",
      needs_review: false,
      review_reasons: [],
      confidence: "high",
      raw_excerpt: "Bella: aku nak matcha strawberry latte 2, dine in",
    },
  ],
  summary: {
    total_orders: 6,
    total_revenue: 129.00,
    items_flagged_for_review: 2,
    parse_warnings: [],
  },
};
