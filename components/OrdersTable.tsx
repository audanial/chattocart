"use client";

import { AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { FulfillmentIcon } from "@/components/FulfillmentIcon";
import type { Order, Status } from "@/lib/types";

interface Props {
  orders: Order[];
  onStatusChange: (orderId: string, status: Status) => void;
}

export function OrdersTable({ orders, onStatusChange }: Props) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-44">Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="w-28 text-right">Total</TableHead>
            <TableHead className="w-32">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.order_id}
              className={
                order.needs_review
                  ? "bg-amber-50/70 hover:bg-amber-50 align-top"
                  : "align-top"
              }
            >
              {/* Customer / ID / Fulfillment */}
              <TableCell className="align-top">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-medium">
                    {order.needs_review && (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    )}
                    <span>{order.customer.name ?? "Unknown"}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{order.order_id}</span>
                  <FulfillmentIcon fulfillment={order.fulfillment} />
                  {order.customer.address && (
                    <span className="text-xs text-muted-foreground leading-snug">
                      {order.customer.address}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Items */}
              <TableCell className="align-top whitespace-normal">
                <ul className="space-y-1">
                  {(order.items ?? []).map((item, i) => (
                    <li key={i} className="text-sm">
                      <span>
                        {item.quantity}× {item.name}
                      </span>
                      {(item.modifiers ?? []).length > 0 && (
                        <span className="text-muted-foreground">
                          {" "}[{(item.modifiers ?? []).join(", ")}]
                        </span>
                      )}
                      {item.line_total != null ? (
                        <span className="text-muted-foreground">
                          {" "}— RM {item.line_total.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground"> — —</span>
                      )}
                      {item.notes && (
                        <div className="text-xs text-muted-foreground italic mt-0.5">
                          {item.notes}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                {(order.review_reasons ?? []).length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {(order.review_reasons ?? []).map((reason, i) => (
                      <li key={i} className="text-xs text-destructive">
                        {reason}
                      </li>
                    ))}
                  </ul>
                )}
              </TableCell>

              {/* Total */}
              <TableCell className="align-top text-right font-medium tabular-nums">
                {order.order_total != null ? (
                  `RM ${order.order_total.toFixed(2)}`
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* Status */}
              <TableCell className="align-top">
                <StatusBadge
                  status={order.status}
                  onChange={(next) => onStatusChange(order.order_id, next)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
