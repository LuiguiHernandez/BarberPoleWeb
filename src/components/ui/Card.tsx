import type { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

export function Card({ className, children }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("rounded-[14px] border border-white/5 bg-white/[0.03] p-5", className)}>{children}</div>
  );
}

