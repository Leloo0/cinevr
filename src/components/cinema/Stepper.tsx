import { Check } from "lucide-react";
import { STEPS } from "@/lib/cinema";
import { cn } from "@/lib/utils";

export function Stepper({ current }: { current: number }) {
  const pct = ((current - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full">
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: "var(--gradient-red)", boxShadow: "var(--glow-red)" }}
        />
      </div>
      <ol className="mt-3 flex justify-between gap-1">
        {STEPS.map((s) => {
          const done = s.id < current;
          const active = s.id === current;
          return (
            <li key={s.id} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full border text-[11px] font-bold transition-all duration-300",
                  done && "border-transparent bg-primary text-primary-foreground",
                  active && "glow-red border-transparent bg-primary text-primary-foreground",
                  !done && !active && "border-border bg-secondary text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : s.id}
              </span>
              <span
                className={cn(
                  "truncate text-[10px] uppercase tracking-[0.18em] sm:text-[11px]",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
