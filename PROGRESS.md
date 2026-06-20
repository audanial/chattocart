# ChatToCart — Progress Log

## 2026-06-18 — Phase 1 + Phase 2

### Phase 1: Project shell
- Created `lib/types.ts` with the full core data model (`Order`, `OrderItem`, `ParseResult`, etc.)
- Built `AppHeader`, `PastePanel`, `DashboardShell`, `EmptyState` shell components
- Wired `app/layout.tsx` and `app/page.tsx` to render the two-column dashboard layout
- All shadcn/ui components (`button`, `card`, `table`, `badge`, `textarea`, `skeleton`) were already present from prior setup
- Parse button renders but does nothing (Phase 3)
- Business name in header: "Makcik Barista"

### Phase 2: Sample data integration
- Created `lib/sampleData.ts` with `SAMPLE_CHAT` (6-customer messy WhatsApp thread) and `SAMPLE_RESULT` (typed `ParseResult` with 6 orders including edge cases: quantity correction, item substitution, ambiguous "the usual", missing fulfillment)
- Created `hooks/useOrders.ts`: initializes from `SAMPLE_RESULT`, exposes `orders`, `summary`, `loading`, `error`; stubs out `parse`, `updateStatus`, `reset`, `loadDemo` for later phases
- Refactored `DashboardShell` to accept `leftPanel` slot so `page.tsx` owns prop wiring
- Updated `PastePanel` to accept `defaultValue` and `onParse` props
- `app/page.tsx` is now a client component — calls `useOrders`, pre-fills textarea with `SAMPLE_CHAT`, renders 6 orders as a plain readable list (OrdersTable comes in Phase 4)

## 2026-06-19 — Phase 3

### Phase 3: Claude parsing API
- Created `lib/aiClient.ts`: initializes OpenAI client pointing at the LiteLLM proxy (`https://litellm.rapidscreen.io/v1`) using `KRACKEDDEVS_API_KEY`; `maxRetries: 0` to prevent silent double-billing on failures
- Created `lib/prompt.ts`: exports `DEFAULT_MENU` (11 Makcik Barista items with prices), `SYSTEM_PROMPT` (ChatToCart order-extraction prompt with Malay/English slang rules, quantity-change resolution, cancellation handling, review-flag logic), and `buildUserMessage(chatText, menu)` helper
- Created `app/api/parse/route.ts`: server-only POST endpoint; calls `claude-sonnet-4-6` at temperature 0, max_tokens 4000; uses assistant-role prefill `"{"` to force clean JSON; reconstructs `"{" + responseText`, strips markdown fences as fallback, `JSON.parse` with try/catch; returns 502 with clear error on any failure; API key never reaches client bundle
- Wired `useOrders.parse()`: replaces stub with real `fetch POST /api/parse`; sets `loading` true during call; on success replaces `orders`/`summary`; on failure sets `error` string and keeps previous data
- Updated `PastePanel`: accepts `loading` prop; disables Parse button and shows "Parsing chat…" while loading
- Updated `app/page.tsx`: passes `parse` and `loading` to `PastePanel`; renders inline error banner above content when `error` is set

### Phase 3 fix (2026-06-19): remove assistant prefill
- LiteLLM proxy rejected the assistant-role prefill message with "conversation must end with a user message"
- Removed `{ role: "assistant", content: "{" }` from the messages array in `app/api/parse/route.ts`
- Removed the `"{" +` reconstruction; `rawText` is now parsed directly from `response.choices[0].message.content`
- Strengthened `SYSTEM_PROMPT` in `lib/prompt.ts` to compensate: added a bolded CRITICAL OUTPUT RULE at the top and a REMINDER at the bottom, both explicitly requiring the response to start with `{` and end with `}` with nothing before or after

## 2026-06-20 — Phase 4 + Phase 5

### Phase 4: Orders table & status workflow
- Created `components/StatusBadge.tsx`: clickable badge cycling new (blue) → preparing (amber) → done (green) → new. Calls `onChange` with the next status on click.
- Created `components/FulfillmentIcon.tsx`: renders a lucide-react icon (ShoppingBag / Truck / Utensils / HelpCircle) with a short text label for pickup, delivery, dine_in, unknown.
- Created `components/OrdersTable.tsx`: shadcn `Table` with columns Customer/ID, Items, Total, Status. Flagged rows (`needs_review: true`) get amber-tinted background, ⚠ icon next to customer name, and `review_reasons` printed in red below the item list. Null `line_total` renders as `—`; resolved totals as `RM X.XX`. Notes appear in muted italic under each item line.
- Wired `useOrders.updateStatus(orderId, status)`: maps over orders state and replaces the matching order's status in place; derived counts update automatically via `useMemo` in `page.tsx`.
- Installed `recharts` package.

### Phase 5: Charts & summary cards
- Created `lib/derive.ts`: pure helpers `computeSummary(orders)` returning `{ total_orders, total_revenue, pending_count, flagged_count }` (revenue sums only non-null order_totals) and `topItems(orders, limit)` returning top N items by total quantity across all orders, sorted descending.
- Created `components/SummaryCards.tsx`: four cards (Orders today, Revenue, Pending, Needs review) derived from `computeSummary` via `useMemo` in `page.tsx`. Revenue formatted as `RM X.XX`.
- Created `components/TopItemsChart.tsx`: Recharts `BarChart` (ResponsiveContainer, 220px height) showing top 5 items by quantity with angled X-axis labels, no tick lines, border-colored grid, and rounded bar corners.
- Updated `app/page.tsx`: replaced inline order list with `SummaryCards` → `OrdersTable` → `TopItemsChart` layout. Derived values computed via two `useMemo` calls from `orders` state; nothing stored as duplicate state. Old summary header text removed.
- TypeScript build passes clean (`tsc --noEmit` zero errors).
