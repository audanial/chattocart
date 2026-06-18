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
