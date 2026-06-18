import { MessageSquare } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center text-muted-foreground py-24">
      <MessageSquare className="size-10 opacity-30" />
      <p className="text-sm font-medium">No orders yet</p>
      <p className="text-xs max-w-xs">
        Paste a WhatsApp chat on the left and click <strong>Parse</strong> to extract orders.
      </p>
    </div>
  );
}
