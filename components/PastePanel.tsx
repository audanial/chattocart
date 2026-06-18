"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface PastePanelProps {
  defaultValue?: string;
  onParse?: (chatText: string) => void;
}

export function PastePanel({ defaultValue = "", onParse }: PastePanelProps) {
  const [chatText, setChatText] = useState(defaultValue);

  return (
    <aside className="flex flex-col gap-3 p-4 border-r border-border bg-card h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Paste WhatsApp Chat</h2>
        <Button variant="outline" size="sm" disabled className="gap-1.5">
          <Upload className="size-3.5" />
          Upload .txt
        </Button>
      </div>
      <Textarea
        className="flex-1 resize-none font-mono text-xs min-h-[300px]"
        placeholder="Paste your WhatsApp order messages here…"
        value={chatText}
        onChange={(e) => setChatText(e.target.value)}
      />
      <Button
        className="w-full"
        disabled={!chatText.trim()}
        onClick={() => onParse?.(chatText)}
      >
        Parse
      </Button>
    </aside>
  );
}
