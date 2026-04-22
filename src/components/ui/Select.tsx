import type { SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full appearance-none rounded-[10px] border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-[14px] text-premium-text outline-none transition",
        "focus:border-premium-primary/50",
        "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238a8177' viewBox='0 0 16 16'%3E%3Cpath d='M8 12L2 6h12z'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

