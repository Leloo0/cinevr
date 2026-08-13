import { Minus, Plus } from "lucide-react";
import { SNACKS, SNACK_CATEGORIES, currency } from "@/lib/cinema";
import { cn } from "@/lib/utils";

type Props = {
  quantities: Record<string, number>;
  onChange: (id: string, delta: number) => void;
};

export function Concessions({ quantities, onChange }: Props) {
  return (
    <div className="space-y-8">
      {SNACK_CATEGORIES.map((cat) => (
        <div key={cat}>
          <h3 className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">{cat}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {SNACKS.filter((s) => s.category === cat).map((s) => {
              const qty = quantities[s.id] ?? 0;
              return (
                <div
                  key={s.id}
                  className={cn(
                    "glass flex items-center gap-4 rounded-xl p-4 transition-all duration-300",
                    qty > 0 && "glow-red",
                  )}
                >
                  <span className="text-3xl" aria-hidden>
                    {s.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{s.desc}</p>
                    <p className="mt-1 text-sm font-semibold text-primary">{currency(s.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Remove one ${s.name}`}
                      onClick={() => onChange(s.id, -1)}
                      disabled={qty === 0}
                      className="grid h-7 w-7 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:opacity-30"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold tabular-nums">{qty}</span>
                    <button
                      type="button"
                      aria-label={`Add one ${s.name}`}
                      onClick={() => onChange(s.id, 1)}
                      className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground transition-transform hover:scale-110"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
