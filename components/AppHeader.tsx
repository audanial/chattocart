import { ShoppingCart } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-border bg-card px-6 py-3 flex items-center gap-3">
      <div className="flex items-center gap-2 text-primary">
        <ShoppingCart className="size-5" />
        <span className="font-semibold text-lg tracking-tight">ChatToCart</span>
      </div>
      <span className="text-muted-foreground text-sm">·</span>
      <span className="text-muted-foreground text-sm">Makcik Barista</span>
    </header>
  );
}
