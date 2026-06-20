"use client";

import type { Status } from "@/lib/types";

const CYCLE: Status[] = ["new", "preparing", "done"];

const STYLES: Record<Status, string> = {
  new: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200",
  preparing: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200",
  done: "bg-green-100 text-green-700 hover:bg-green-200 border-green-200",
};

const LABELS: Record<Status, string> = {
  new: "New",
  preparing: "Preparing",
  done: "Done",
};

interface Props {
  status: Status;
  onChange: (next: Status) => void;
}

export function StatusBadge({ status, onChange }: Props) {
  function handleClick() {
    const idx = CYCLE.indexOf(status);
    onChange(CYCLE[(idx + 1) % CYCLE.length]);
  }
  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer ${STYLES[status]}`}
    >
      {LABELS[status]}
    </button>
  );
}
