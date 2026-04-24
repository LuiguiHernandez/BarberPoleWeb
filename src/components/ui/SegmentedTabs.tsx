import { cn } from "../../utils/cn";

export function SegmentedTabs<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (next: T) => void;
}) {
  return (
    <div className="inline-flex rounded-[10px] border border-premium-border bg-[rgba(179,207,229,0.12)] dark:bg-white/[0.04] p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition",
              active
                ? "bg-premium-primary/15 text-premium-primary"
                : "text-premium-muted hover:text-premium-text",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
