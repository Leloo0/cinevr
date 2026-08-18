import { Clapperboard, MapPin } from "lucide-react";
import { QrCode } from "./QrCode";
import { currency, type Movie, type Format } from "@/lib/cinema";

type Props = {
  code: string;
  movie: Movie;
  format: Format;
  showtime: string;
  seats: string[];
  snackLines: { id: string; name: string; qty: number; total: number }[];
  total: number;
};

export function Voucher({ code, movie, format, showtime, seats, snackLines, total }: Props) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="glass overflow-hidden rounded-2xl">
        <div
          className="flex items-center gap-3 px-6 py-4"
          style={{ background: "var(--gradient-red)" }}
        >
          <Clapperboard className="h-5 w-5 text-primary-foreground" />
          <span className="font-display text-sm font-bold uppercase tracking-[0.3em] text-primary-foreground">
            Ingresso Digital
          </span>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <h3 className="font-display text-xl font-bold">{movie.title}</h3>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Sala 07 · {format.name} · Hoje às{" "}
              {showtime}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <dl className="space-y-2 text-sm">
              <Row label="Assentos" value={[...seats].sort().join(", ")} />
              <Row label="Classificação" value={`${movie.rating} anos`} />
              <Row label="Duração" value={movie.duration} />
              {snackLines.map((l) => (
                <Row key={l.id} label={`${l.qty}× ${l.name}`} value={currency(l.total)} />
              ))}
              <Row label="Total pago" value={currency(total)} />
            </dl>
            <QrCode value={code} size={150} label="Validação na entrada" />
          </div>

          <div className="border-t border-dashed border-border pt-4">
            <p className="text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Código {code}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
