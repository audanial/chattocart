import { Info } from "lucide-react";

interface Props {
  warnings: string[];
}

export function ParseWarnings({ warnings }: Props) {
  if (warnings.length === 0) return null;

  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
      <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
      <ul className="space-y-0.5">
        {warnings.map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
    </div>
  );
}
