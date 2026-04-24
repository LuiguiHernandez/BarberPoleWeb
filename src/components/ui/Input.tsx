import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-[10px] border border-premium-border bg-premium-panel px-3.5 py-2.5 text-[14px] text-premium-text outline-none transition",
        "placeholder:text-premium-muted/70 focus:border-premium-primary/50",
        className,
      )}
      {...props}
    />
  );
}

