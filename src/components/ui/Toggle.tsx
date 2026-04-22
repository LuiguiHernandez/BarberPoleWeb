import type { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

export type ToggleProps = PropsWithChildren<{
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  className?: string;
}>;

export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  return (
    <label className={cn("inline-flex items-center gap-3 cursor-pointer select-none", className)}>
      <span
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onChange(!checked);
        }}
        className={cn(
          "relative h-6 w-11 rounded-full transition flex-shrink-0",
          checked ? "bg-premium-primary" : "bg-white/10",
        )}
      >
        <span
          className={cn(
            "absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow",
            "transition-[left] duration-200",
            checked ? "left-[23px]" : "left-[3px]",
          )}
        />
      </span>

      {label ? <span className="text-[14px] text-premium-text">{label}</span> : null}
    </label>
  );
}

