"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface PastePanelProps {
  defaultValue?: string;
  onParse?: (chatText: string) => void;
  loading?: boolean;
}

export function PastePanel({ defaultValue = "", onParse, loading = false }: PastePanelProps) {
  const [chatText, setChatText] = useState(defaultValue);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUploadClick() {
    setUploadError(null);
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset so the same file can be re-selected after an error
    e.target.value = "";
    if (!file) return;

    file.text().then((text) => {
      setChatText(text);
      setUploadError(null);
    }).catch(() => {
      setUploadError("Could not read file. Please try again.");
    });
  }

  return (
    <aside className="flex flex-col gap-3 p-4 border-r border-border bg-card h-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,text/plain"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Paste WhatsApp Chat</h2>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleUploadClick}>
          <Upload className="size-3.5" />
          Upload .txt
        </Button>
      </div>
      {uploadError && (
        <p className="text-xs text-destructive">{uploadError}</p>
      )}
      <Textarea
        className="flex-1 resize-none font-mono text-xs min-h-[300px]"
        placeholder="Paste your WhatsApp order messages here…"
        value={chatText}
        onChange={(e) => setChatText(e.target.value)}
      />
      <Button
        className="w-full text-white"
        style={{ backgroundColor: "var(--brand-terracotta)", borderColor: "var(--brand-terracotta)" }}
        disabled={!chatText.trim() || loading}
        onClick={() => onParse?.(chatText)}
      >
        {loading ? "Parsing chat…" : "Parse"}
      </Button>
    </aside>
  );
}
