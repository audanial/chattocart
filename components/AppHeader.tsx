import { ShoppingCart } from "lucide-react";

export function AppHeader() {
  return (
    <header
      className="px-6 py-3 flex items-center gap-3"
      style={{ backgroundColor: "var(--brand-green)", color: "var(--brand-cream)" }}
    >
      <div className="flex items-center gap-2">
        <ShoppingCart className="size-5" />
        <span className="font-heading font-semibold text-xl tracking-tight">
          ChatToCart
        </span>
      </div>
      <span className="opacity-50 text-sm">·</span>
      <span className="text-sm opacity-80">Makcik Barista</span>
    </header>
  );
}
