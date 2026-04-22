import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary" | "ghost";
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
        "hover:brightness-110 hover:-translate-y-px",
        size === "md" ? "px-5 py-2.5 text-[14px]" : "px-3.5 py-2 text-[13px]",
        variant === "primary" &&
          "bg-gradient-to-br from-premium-primary to-premium-primary2 text-white shadow-primary border border-transparent",
        variant === "secondary" &&
          "bg-white/5 border border-white/10 text-premium-text font-medium",
        variant === "ghost" && "bg-transparent border border-white/5 text-premium-muted font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

