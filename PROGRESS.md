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

## 2026-06-20 — Phase 6

### Phase 6: Review flags & edge cases
- Created `components/ParseWarnings.tsx`: renders a subtle amber strip (`bg-amber-50`, `border-amber-200`, `text-amber-800`) with an Info icon and one `<li>` per warning. Returns `null` when `warnings` is empty so it takes up no space.
- Updated `app/page.tsx`: destructures `summary` from `useOrders`; renders `<ParseWarnings warnings={summary.parse_warnings ?? []} />` between SummaryCards and OrdersTable.
- Defensive null guards in `components/OrdersTable.tsx`: `order.items ?? []`, `order.review_reasons ?? []`, and `item.modifiers ?? []` so a malformed AI response that omits these arrays cannot crash the table.
- `SummaryCards` and `TopItemsChart` were already safe: `computeSummary` always returns numbers, chart guards on empty `items` array.
- TypeScript build passes clean.

## 2026-06-20 — Phase 7

### Phase 7: localStorage persistence
- Created `lib/storage.ts`: `loadOrders()` parses `chattocart_result` from localStorage (returns `null` on missing key, parse error, or SSR); `saveOrders(result)` serializes the full `ParseResult` to the same key. Both functions guard on `typeof window === "undefined"` so they are safe in Next.js SSR contexts and silently swallow quota/private-mode errors.
- Updated `hooks/useOrders.ts`:
  - Added `useEffect(() => { const stored = loadOrders(); if (stored) { setOrders(...); setSummary(...); } }, [])` — runs client-only after first render, so the server and client initial render both use `SAMPLE_RESULT` (no hydration mismatch). If localStorage holds a prior result it replaces the sample data immediately after mount.
  - `parse()` success path calls `saveOrders({ orders, summary })` with the fresh API result before returning.
  - `updateStatus()` computes the next orders array inside the `setOrders` functional updater, then calls `saveOrders` with it synchronously before returning — guarantees the persisted state matches the exact value React will commit.

## 2026-06-21 — Brand theme (Makcik Barista)

### Visual theme pass
- Added `Playfair Display` via `next/font/google` as `--font-playfair`; wired to `--font-heading` in `@theme inline` so the `font-heading` Tailwind utility activates it.
- Added three CSS custom properties in `:root` as the single source of truth for brand colors:
  - `--brand-green: #1F3A1A` (deep forest green)
  - `--brand-terracotta: #C8732F` (warm terracotta)
  - `--brand-cream: #F5F0E6` (warm cream)
- Updated shadcn tokens: `--background` → cream, `--primary` → forest green, `--primary-foreground` → cream off-white. All other semantic tokens (status badge blue/amber/green, destructive red, review amber) left untouched.
- `AppHeader`: forest green background via `var(--brand-green)`, cream text, "ChatToCart" title uses `font-heading` (Playfair Display).
- `PastePanel` Parse button: terracotta via `var(--brand-terracotta)` inline style; disabled state falls back to shadcn's built-in `opacity-50`.
- `SummaryCards`: Revenue value rendered in terracotta (`var(--brand-terracotta)`); other card values unchanged.
- `TopItemsChart`: Bar fill changed from `#378ADD` to `var(--brand-terracotta)`; "Top Items" card title uses `font-heading`.

## 2026-06-21 — Upload .txt

### PastePanel file upload
- Removed `disabled` from the "Upload .txt" button.
- Added a hidden `<input type="file" accept=".txt,text/plain">` controlled via a `useRef`.
- Clicking the button calls `.click()` on the hidden input, opening the native OS file picker filtered to `.txt` files.
- On file selection, uses `file.text()` (browser File API) to read the content and replace the textarea value.
- Input value is reset after each selection so the same file can be re-uploaded after an error.
- Read errors surface as an inline `text-destructive` message below the button row; the error clears on the next upload attempt.
