import { ROWS, COLS, OCCUPIED } from "@/lib/cinema";
import { cn } from "@/lib/utils";

type Props = {
  selected: string[];
  onToggle: (seat: string) => void;
};

export function SeatMap({ selected, onToggle }: Props) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="mb-6">
        <div
          className="mx-auto h-1.5 w-3/4 rounded-full"
          style={{ background: "var(--gradient-red)", boxShadow: "var(--glow-red)" }}
        />
        <p className="mt-2 text-center text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
          Screen
        </p>
      </div>

      <div className="space-y-2 overflow-x-auto">
        {ROWS.map((row) => (
          <div key={row} className="flex items-center justify-center gap-2">
            <span className="w-5 text-xs font-medium text-muted-foreground">{row}</span>
            {Array.from({ length: COLS }, (_, i) => i + 1).map((n) => {
              const id = `${row}${n}`;
              const occupied = OCCUPIED.has(id);
              const isSelected = selected.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  disabled={occupied}
                  aria-label={`Seat ${id}${occupied ? " occupied" : ""}`}
                  onClick={() => onToggle(id)}
                  className={cn(
                    "h-7 w-7 shrink-0 rounded-md border text-[10px] font-semibold transition-all duration-300",
                    occupied &&
                      "cursor-not-allowed border-transparent bg-muted/40 text-muted-foreground/30",
                    !occupied &&
                      !isSelected &&
                      "border-border bg-secondary text-muted-foreground hover:-translate-y-0.5 hover:border-primary/60 hover:text-foreground",
                    isSelected &&
                      "glow-red -translate-y-0.5 border-transparent bg-primary text-primary-foreground",
                  )}
                >
                  {n}
                </button>
              );
            })}
            <span className="w-5 text-xs font-medium text-muted-foreground">{row}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-5 text-xs text-muted-foreground">
        <Legend className="bg-secondary border border-border" label="Available" />
        <Legend className="bg-primary glow-red" label="Selected" />
        <Legend className="bg-muted/40" label="Occupied" />
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={cn("h-3.5 w-3.5 rounded-[4px]", className)} />
      {label}
    </span>
  );
}
