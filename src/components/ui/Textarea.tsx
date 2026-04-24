import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-[10px] border border-premium-border bg-premium-panel px-3.5 py-2.5 text-[14px] text-premium-text outline-none transition",
        "placeholder:text-premium-muted/70 focus:border-premium-primary/50",
        className,
      )}
      {...props}
    />
  );
}

