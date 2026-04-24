import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export function StatCard({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-premium-border bg-premium-panel px-5 py-4 shadow-card",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-[12px] text-premium-muted">{label}</div>
        {icon ? <div className="text-premium-primary/80">{icon}</div> : null}
      </div>
      <div className="mt-2 text-[20px] font-semibold text-premium-text">{value}</div>
    </div>
  );
}
