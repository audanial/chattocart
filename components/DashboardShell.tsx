import { AppHeader } from "@/components/AppHeader";

interface DashboardShellProps {
  leftPanel: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardShell({ leftPanel, children }: DashboardShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 shrink-0 flex flex-col overflow-y-auto">
          {leftPanel}
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
