# ChatToCart — Implementation Plan (4-Day Hackathon MVP)

> Spec for Claude Code. Build in phase order. Ship over perfection.

## Stack
Next.js (App Router, TypeScript) · Tailwind · shadcn/ui · Recharts · Claude API · localStorage · Vercel.

## Hard guardrails (do NOT do)
- No authentication. No user accounts.
- No database. State lives in React + localStorage only.
- No live WhatsApp integration. Input is pasted text or an uploaded `.txt`.
- No payments, inventory, CRM, notifications, multi-user, mobile app, dark-mode toggle.
- If a feature is not in a phase below, do not build it.

## Day mapping
- **Day 1:** Phase 1 + Phase 2
- **Day 2:** Phase 3 + Phase 4
- **Day 3:** Phase 5 + Phase 6 + Phase 7
- **Day 4:** Phase 8 + record demo + submit

## Core data model (single source of truth)
```ts
// lib/types.ts
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
export interface ParseResult { orders: Order[]; summary: ParseSummary }
```

---

## Phase 1 — Project setup & dashboard UI shell
**Objective:** Running Next.js app on Vercel with the empty dashboard layout matching the mockup.

**Components to build**
- `AppHeader` (logo, "ChatToCart", business name "Kak Yan's Kitchen")
- `PastePanel` (textarea, Upload .txt button [non-functional stub], Parse button)
- `DashboardShell` (2-col grid: left panel + right `main` region)
- `EmptyState` (placeholder shown before first parse)

**Files to create**
- `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- `components/AppHeader.tsx`, `components/PastePanel.tsx`, `components/DashboardShell.tsx`, `components/EmptyState.tsx`
- `lib/types.ts`
- shadcn init + add: `button`, `card`, `table`, `badge`, `textarea`, `skeleton`

**State management**
- None yet beyond local component state for the textarea value.

**Acceptance criteria**
- Deploys to Vercel with a live URL.
- Layout matches mockup: left paste panel, right empty-state region, header.
- Parse button renders but does nothing yet.

**Definition of Done:** Live URL loads the shell with no console errors; responsive at laptop width.

---

## Phase 2 — Sample data integration
**Objective:** Hardcoded `ParseResult` renders the full dashboard without calling the API, so UI work is unblocked.

**Components to build**
- None new — feed sample data into the (still-stub) render path.

**Files to create**
- `lib/sampleData.ts` — exports `SAMPLE_RESULT: ParseResult` (the 5 demo orders: Ali, Siti, Raju, Kak Yan [flagged], Chong) and `SAMPLE_CHAT: string` (pre-filled messy chat).

**State management**
- `useOrders` hook (created here) initialized from `SAMPLE_RESULT`. Holds `orders`, `summary`, and setters.

**Acceptance criteria**
- Importing sample data and calling the hook renders 5 orders end-to-end.
- PastePanel textarea defaults to `SAMPLE_CHAT`.

**Definition of Done:** Dashboard shows realistic data from `sampleData.ts`; no API needed to develop UI.

---

## Phase 3 — Claude parsing API
**Objective:** `POST /api/parse` turns chat text into a valid `ParseResult`.

**Components to build**
- Wire PastePanel Parse button → fetch `/api/parse` → update `useOrders`.
- Loading state ("Parsing chat…") + error toast/inline message.

**Files to create**
- `app/api/parse/route.ts` (server route, key in `.env.local` as `ANTHROPIC_API_KEY`, `temperature: 0`, model `claude-sonnet-4-6`, strip fences, `JSON.parse` with try/catch fallback)
- `lib/prompt.ts` (the ChatToCart system prompt + optional menu string)
- `lib/anthropic.ts` (SDK client init)
- `.env.local.example`

**State management**
- `useOrders`: add `parse(chatText)` async action → sets loading → on success replaces `orders`/`summary` → on failure sets error, keeps prior data.

**Acceptance criteria**
- Pasting the sample chat returns 5 structured orders with correct fields.
- Malformed model output returns 502 without crashing the UI.
- Key never reaches the client bundle.

**Definition of Done:** Real Claude parse populates the dashboard from the textarea; failures handled gracefully.

---

## Phase 4 — Orders table & status workflow
**Objective:** Polished table with clickable status cycling.

**Components to build**
- `OrdersTable` (columns: Customer/ID, Items + fulfillment icon + notes, Total, Status)
- `StatusBadge` (click cycles new → preparing → done; semantic colors)
- `FulfillmentIcon` (pickup/delivery/dine_in)

**Files to create**
- `components/OrdersTable.tsx`, `components/StatusBadge.tsx`, `components/FulfillmentIcon.tsx`

**State management**
- `useOrders`: add `updateStatus(orderId, status)`. Status change updates the order in place and recomputes derived counts.

**Acceptance criteria**
- All orders render; items show modifiers and notes (e.g. "qty changed 2→3").
- Clicking a badge cycles status and updates instantly.
- Totals render as `RM 0.00`; null totals render as `—`.

**Definition of Done:** Table is demo-clean; status toggles work without page reload.

---

## Phase 5 — Charts & summary cards
**Objective:** Summary cards + top-items chart driven by current order state.

**Components to build**
- `SummaryCards` (Orders today, Revenue, Pending [status ≠ done], Needs review)
- `TopItemsChart` (Recharts `BarChart`, item name × total quantity, top 5)

**Files to create**
- `components/SummaryCards.tsx`, `components/TopItemsChart.tsx`
- `lib/derive.ts` (pure helpers: `computeSummary`, `topItems` — derive from `orders`, not stored separately)

**State management**
- Derived values computed from `orders` via `useMemo`. Do not store duplicates in state.

**Acceptance criteria**
- Cards update live when a status changes (Pending count) or after a re-parse.
- Chart aggregates quantities correctly across orders.

**Definition of Done:** Cards + chart reflect live state and recompute on every change.

---

## Phase 6 — Review flags & edge cases
**Objective:** Make the "it asks instead of guessing" behavior visible and handle messy parses safely.

**Components to build**
- Flagged-row treatment in `OrdersTable` (warning icon + tinted row + `review_reasons` text).
- `ParseWarnings` strip (shows `summary.parse_warnings`, e.g. removed cancelled item).

**Files to create**
- `components/ParseWarnings.tsx`

**State management**
- No new state; reads `needs_review`, `review_reasons`, `summary.parse_warnings`.

**Acceptance criteria**
- Kak Yan order shows flagged, unpriced, with "ambiguous item · no address".
- Empty parse result shows EmptyState, not a broken table.
- Orders with null fields never crash the table.

**Definition of Done:** Every sample edge case renders correctly; no runtime errors on null/missing data.

---

## Phase 7 — localStorage persistence
**Objective:** Orders survive a page refresh.

**Components to build**
- None — wire persistence into the hook.

**Files to create**
- `lib/storage.ts` (`loadOrders()`, `saveOrders(result)`, SSR-safe guard for `window`)

**State management**
- `useOrders`: on mount, hydrate from localStorage (fallback to `SAMPLE_RESULT`); on any change (`parse`, `updateStatus`), persist.

**Acceptance criteria**
- Refresh restores last orders + statuses.
- No hydration mismatch / `window is not defined` errors.

**Definition of Done:** Refreshing the deployed app keeps state.

---

## Phase 8 — Demo mode & polish
**Objective:** One-click reproducible demo + visual finish for recording.

**Components to build**
- `DemoControls` ("Load demo chat" resets textarea to `SAMPLE_CHAT`; "Reset" clears to EmptyState).
- Final spacing, colors, RM formatting, icons, mobile-narrow check.

**Files to create**
- `components/DemoControls.tsx`

**State management**
- `useOrders`: add `reset()` and `loadDemo()`.

**Acceptance criteria**
- Fresh visitor can reproduce the full demo in under 15 seconds.
- Parse → table → status toggle → flagged row all visually clean.
- No layout shift or console errors during the demo flow.

**Definition of Done:** App is recording-ready; demo runs start-to-finish reliably. Tag a release / final Vercel deploy.

---

## Recommended folder structure
```
chattocart/
├─ app/
│  ├─ api/
│  │  └─ parse/route.ts        # Claude parsing endpoint
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx                 # dashboard page (composes everything)
├─ components/
│  ├─ AppHeader.tsx
│  ├─ DashboardShell.tsx
│  ├─ PastePanel.tsx
│  ├─ EmptyState.tsx
│  ├─ SummaryCards.tsx
│  ├─ OrdersTable.tsx
│  ├─ StatusBadge.tsx
│  ├─ FulfillmentIcon.tsx
│  ├─ TopItemsChart.tsx
│  ├─ ParseWarnings.tsx
│  ├─ DemoControls.tsx
│  └─ ui/                      # shadcn generated (button, card, table, badge, textarea, skeleton)
├─ hooks/
│  └─ useOrders.ts             # single source of truth + actions + persistence
├─ lib/
│  ├─ types.ts
│  ├─ prompt.ts                # system prompt + menu
│  ├─ anthropic.ts             # SDK client
│  ├─ sampleData.ts            # SAMPLE_CHAT + SAMPLE_RESULT
│  ├─ derive.ts                # computeSummary, topItems
│  └─ storage.ts               # localStorage helpers
├─ .env.local.example
└─ PLAN.md                     # this file
```

## Component hierarchy
```
app/page.tsx
└─ DashboardShell
   ├─ AppHeader
   ├─ PastePanel            (textarea, Upload stub, Parse → useOrders.parse)
   │  └─ DemoControls
   └─ main region
      ├─ EmptyState         (when no orders)
      └─ when orders exist:
         ├─ SummaryCards         (derived from orders)
         ├─ ParseWarnings        (summary.parse_warnings)
         ├─ OrdersTable
         │  └─ rows → StatusBadge + FulfillmentIcon  (flagged rows tinted)
         └─ TopItemsChart        (Recharts, derived top 5)
```

## State ownership (summary)
`useOrders` owns everything: `orders`, `summary`, `loading`, `error`, and actions `parse(text)`, `updateStatus(id, status)`, `reset()`, `loadDemo()`. Summary cards and chart values are **derived** via `useMemo` from `orders` — never duplicated in state. Persistence is a side effect inside the hook.

## Suggested build order for Claude Code (one sitting per phase)
1. Scaffold + deploy (Phase 1) before writing any logic — get the live URL early.
2. Build UI against `sampleData` (Phase 2) so you never block on the API.
3. Only then wire the real API (Phase 3). If it misbehaves, you still have a working demo on sample data.
