import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "sm";

export type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
  }
>;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none",
        "hover:brightness-105 hover:-translate-y-px",
        size === "md" ? "px-5 py-2.5 text-[14px]" : "px-3.5 py-2 text-[13px]",
        variant === "primary" &&
          "bg-gradient-to-br from-premium-primary to-premium-primary2 text-white shadow-primary border border-transparent",
        variant === "secondary" &&
          "bg-[rgba(179,207,229,0.18)] dark:bg-white/5 border border-premium-border text-premium-text font-medium hover:bg-[rgba(179,207,229,0.30)] dark:hover:bg-white/10",
        variant === "ghost" &&
          "bg-transparent border border-premium-border text-premium-muted font-medium hover:bg-[rgba(179,207,229,0.15)] dark:hover:bg-white/5",
        variant === "danger" &&
          "bg-premium-danger text-white border border-transparent shadow-[0_4px_12px_rgba(220,38,38,0.25)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
