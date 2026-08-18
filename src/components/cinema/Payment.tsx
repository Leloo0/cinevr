import { CreditCard, QrCode as QrIcon, ShieldCheck } from "lucide-react";
import { QrCode } from "./QrCode";
import { currency } from "@/lib/cinema";
import { cn } from "@/lib/utils";

export type PaymentMethod = "pix" | "card";

type Props = {
  method: PaymentMethod;
  onMethod: (m: PaymentMethod) => void;
  pixPayload: string;
  total: number;
  card: { name: string; number: string; expiry: string; cvv: string };
  onCard: (patch: Partial<Props["card"]>) => void;
};

export function Payment({ method, onMethod, pixPayload, total, card, onCard }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <MethodCard
          active={method === "pix"}
          onClick={() => onMethod("pix")}
          icon={<QrIcon className="h-5 w-5" />}
          title="PIX"
          desc="Aprovação imediata · sem taxas"
        />
        <MethodCard
          active={method === "card"}
          onClick={() => onMethod("card")}
          icon={<CreditCard className="h-5 w-5" />}
          title="Cartão de Crédito"
          desc="Em até 3x sem juros"
        />
      </div>

      {method === "pix" ? (
        <div className="glass flex flex-col items-center gap-4 rounded-2xl p-6 text-center">
          <QrCode value={pixPayload} size={200} label="Escaneie no app do seu banco" />
          <p className="text-sm text-muted-foreground">
            Valor a pagar: <span className="font-semibold text-foreground">{currency(total)}</span>
          </p>
          <code className="max-w-full break-all rounded-lg border border-border bg-secondary px-3 py-2 text-[11px] text-muted-foreground">
            {pixPayload}
          </code>
        </div>
      ) : (
        <div className="glass grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
          <Field
            label="Nome impresso no cartão"
            className="sm:col-span-2"
            value={card.name}
            placeholder="MARIA S SOUZA"
            onChange={(v) => onCard({ name: v })}
          />
          <Field
            label="Número do cartão"
            className="sm:col-span-2"
            value={card.number}
            placeholder="0000 0000 0000 0000"
            inputMode="numeric"
            onChange={(v) => onCard({ number: v })}
          />
          <Field
            label="Validade"
            value={card.expiry}
            placeholder="MM/AA"
            onChange={(v) => onCard({ expiry: v })}
          />
          <Field
            label="CVV"
            value={card.cvv}
            placeholder="123"
            inputMode="numeric"
            onChange={(v) => onCard({ cvv: v })}
          />
        </div>
      )}

      <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-primary" />
        Ambiente simulado — nenhum pagamento real é processado.
      </p>
    </div>
  );
}

function MethodCard({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "glass flex items-center gap-4 rounded-xl p-4 text-left transition-all duration-300",
        active ? "glow-red" : "hover:border-primary/40",
      )}
    >
      <span
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-lg border transition-colors",
          active
            ? "border-transparent bg-primary text-primary-foreground"
            : "border-primary/25 bg-secondary text-primary",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-semibold">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">{desc}</span>
      </span>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  className,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary"
      />
    </label>
  );
}
