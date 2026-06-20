import { ShoppingBag, Truck, Utensils, HelpCircle } from "lucide-react";
import type { Fulfillment } from "@/lib/types";

const ICONS: Record<Fulfillment, React.ElementType> = {
  pickup: ShoppingBag,
  delivery: Truck,
  dine_in: Utensils,
  unknown: HelpCircle,
};

const LABELS: Record<Fulfillment, string> = {
  pickup: "Pickup",
  delivery: "Delivery",
  dine_in: "Dine in",
  unknown: "Unknown",
};

interface Props {
  fulfillment: Fulfillment;
}

export function FulfillmentIcon({ fulfillment }: Props) {
  const Icon = ICONS[fulfillment];
  return (
    <span
      className="inline-flex items-center gap-1 text-muted-foreground"
      title={LABELS[fulfillment]}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="text-xs">{LABELS[fulfillment]}</span>
    </span>
  );
}
