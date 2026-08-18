import { ArrowLeft, ArrowRight, Ticket } from "lucide-react";
import { currency } from "@/lib/cinema";
import { cn } from "@/lib/utils";

type Props = {
  step: number;
  lines: { label: string; value: string }[];
  total: number;
  canAdvance: boolean;
  nextLabel: string;
  hint?: string;
  onBack: () => void;
  onNext: () => void;
};

export function OrderSidebar({
  step,
  lines,
  total,
  canAdvance,
  nextLabel,
  hint,
  onBack,
  onNext,
}: Props) {
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Seu pedido</h2>

      <div className="mt-4 space-y-3 text-sm">
        {lines.map((l) => (
          <div key={l.label} className="flex items-start justify-between gap-4">
            <span className="text-muted-foreground">{l.label}</span>
            <span className="text-right font-medium">{l.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Total</span>
        <span className="font-display text-2xl font-bold text-gradient-red">
          {currency(total)}
        </span>
      </div>

      <div className="mt-5 flex gap-2">
        {step > 1 && step < 5 && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        )}
        <button
          type="button"
          disabled={!canAdvance}
          onClick={onNext}
          className={cn(
            "glow-red flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-primary-foreground transition-transform duration-300",
            canAdvance
              ? "hover:scale-[1.02]"
              : "cursor-not-allowed opacity-40 shadow-none",
          )}
        >
          {step === 5 ? <Ticket className="h-4 w-4" /> : null}
          {nextLabel}
          {step < 4 && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>

      {hint && <p className="mt-2 text-center text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
