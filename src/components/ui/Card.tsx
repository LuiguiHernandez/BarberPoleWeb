import type { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

export function Card({ className, children }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("rounded-[14px] border border-premium-border bg-premium-panel p-5", className)}>
      {children}
    </div>
  );
}
