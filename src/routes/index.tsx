import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import { Clapperboard, Sparkles } from "lucide-react";
import { SeatMap } from "@/components/cinema/SeatMap";
import { Concessions } from "@/components/cinema/Concessions";
import { MoviePicker } from "@/components/cinema/MoviePicker";
import { Stepper } from "@/components/cinema/Stepper";
import { OrderSidebar } from "@/components/cinema/OrderSidebar";
import { Payment, type PaymentMethod } from "@/components/cinema/Payment";
import { Voucher } from "@/components/cinema/Voucher";
import {
  BOOKING_FEE_PER_SEAT,
  FORMATS,
  MOVIES,
  SNACKS,
  currency,
  type FormatId,
  type Movie,
  type Showtime,
} from "@/lib/cinema";
import { cn } from "@/lib/utils";

const TheaterScene = lazy(() => import("@/components/cinema/TheaterScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CINE-VR · Ingressos de cinema com prévia 3D dos assentos" },
      {
        name: "description",
        content:
          "Escolha filme, sessão e assento com prévia sensorial 3D em IMAX ou ScreenX 270°, adicione itens da bomboniere e receba seu ingresso digital com QR Code.",
      },
      { property: "og:title", content: "CINE-VR · Ingressos com prévia 3D dos assentos" },
      {
        property: "og:description",
        content:
          "Compra de ingressos em 5 etapas: sessão, assento com visualização 3D, bomboniere, pagamento via PIX ou cartão e voucher digital.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [step, setStep] = useState(1);
  const [movieId, setMovieId] = useState<string | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [format, setFormat] = useState<FormatId>("imax");
  const [seats, setSeats] = useState<string[]>([]);
  const [focusSeat, setFocusSeat] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [code, setCode] = useState("");

  const movie = MOVIES.find((m) => m.id === movieId) ?? null;
  const activeFormat = FORMATS.find((f) => f.id === format)!;

  const toggleSeat = (id: string) => {
    setFocusSeat(id);
    setSeats((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const changeQty = (id: string, delta: number) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));

  const snackLines = useMemo(
    () =>
      SNACKS.filter((s) => (quantities[s.id] ?? 0) > 0).map((s) => ({
        ...s,
        qty: quantities[s.id]!,
        total: quantities[s.id]! * s.price,
      })),
    [quantities],
  );

  const ticketsTotal = seats.length * activeFormat.price;
  const snacksTotal = snackLines.reduce((a, l) => a + l.total, 0);
  const fees = seats.length * BOOKING_FEE_PER_SEAT;
  const grandTotal = ticketsTotal + snacksTotal + fees;

  const pixPayload = `00020126CINEVR${(movie?.id ?? "sessao").toUpperCase()}${(showtime ?? "").replace(":", "")}5204899953039865802BR5909CINE-VR6009SAO PAULO54${grandTotal.toFixed(2)}6304A1B2`;

  const cardOk =
    card.name.trim().length > 2 &&
    card.number.replace(/\D/g, "").length >= 13 &&
    card.expiry.trim().length >= 4 &&
    card.cvv.trim().length >= 3;

  const canAdvance =
    step === 1
      ? Boolean(movie && showtime)
      : step === 2
        ? seats.length > 0
        : step === 3
          ? true
          : step === 4
            ? method === "pix" || cardOk
            : true;

  const hint =
    step === 1 && !canAdvance
      ? "Escolha um filme e um horário"
      : step === 2 && !canAdvance
        ? "Selecione ao menos um assento"
        : step === 4 && !canAdvance
          ? "Preencha os dados do cartão"
          : undefined;

  const nextLabel =
    step === 4 ? "Pagar " + currency(grandTotal) : step === 5 ? "Nova compra" : "Avançar";

  const goNext = () => {
    if (step === 4) {
      setCode(`CVR-${Math.abs(hashCode(pixPayload)).toString(36).toUpperCase().slice(0, 8)}`);
      setStep(5);
      return;
    }
    if (step === 5) {
      setStep(1);
      setMovieId(null);
      setShowtime(null);
      setSeats([]);
      setFocusSeat(null);
      setQuantities({});
      setCard({ name: "", number: "", expiry: "", cvv: "" });
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  };

  const sidebarLines = [
    { label: "Filme", value: movie?.title ?? "Não escolhido" },
    { label: "Sessão", value: showtime ? `Hoje · ${showtime}` : "—" },
    { label: "Formato", value: activeFormat.name },
    {
      label: `Assentos (${seats.length})`,
      value: seats.length ? [...seats].sort().join(", ") : "Nenhum",
    },
    { label: "Ingressos", value: currency(ticketsTotal) },
    ...snackLines.map((l) => ({ label: `${l.qty}× ${l.name}`, value: currency(l.total) })),
    { label: "Taxa de conveniência", value: currency(fees) },
  ];

  return (
    <div className="min-h-screen hero-veil">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-9 w-9 place-items-center rounded-lg"
                style={{ background: "var(--gradient-red)", boxShadow: "var(--glow-red)" }}
              >
                <Clapperboard className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="font-display text-lg font-bold tracking-[0.18em]">CINE-VR</span>
            </div>

            <div className="hidden h-8 w-px bg-border md:block" />

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold sm:text-lg">
                Ingressos com <span className="text-gradient-red">prévia 3D</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                {movie ? `${movie.title} · ${showtime ?? "escolha o horário"}` : "Sala 07 · Hoje"}
              </p>
            </div>

            {step === 2 && (
              <div className="ml-auto flex flex-wrap gap-1.5 rounded-xl border border-border p-1">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormat(f.id)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-300",
                      format === f.id
                        ? "glow-red bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <Stepper current={step} />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          {step === 1 && (
            <section>
              <SectionTitle
                eyebrow="Etapa 1"
                title="Escolha o filme e a sessão"
                hint="Sessões de hoje · Sala 07"
              />
              <MoviePicker
                movieId={movieId}
                showtime={showtime}
                onSelectMovie={(m: Movie) => setMovieId(m.id)}
                onSelect={(m, t) => {
                  setMovieId(m.id);
                  setShowtime(t);
                }}
              />
            </section>
          )}

          {step === 2 && (
            <>
              <section>
                <SectionTitle
                  eyebrow="Prévia sensorial"
                  title="Sua visão da poltrona"
                  hint={
                    focusSeat
                      ? `Câmera travada no assento ${focusSeat}`
                      : "Selecione um assento para mover a câmera"
                  }
                />
                <div className="glass relative h-[420px] overflow-hidden rounded-2xl">
                  <ClientOnly fallback={<CanvasFallback />}>
                    <Suspense fallback={<CanvasFallback />}>
                      <TheaterScene format={format} focusSeat={focusSeat} />
                    </Suspense>
                  </ClientOnly>
                  <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-primary/40 bg-background/60 px-3 py-1 text-[11px] uppercase tracking-[0.25em] backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    {activeFormat.name}
                  </div>
                  <p className="pointer-events-none absolute bottom-4 right-4 text-[11px] text-muted-foreground">
                    {activeFormat.blurb}
                  </p>
                </div>
              </section>

              <section>
                <SectionTitle
                  eyebrow="Etapa 2"
                  title="Escolha seus assentos"
                  hint={`Fileiras A–G · ${currency(activeFormat.price)} por assento`}
                />
                <SeatMap selected={seats} onToggle={toggleSeat} />
              </section>
            </>
          )}

          {step === 3 && (
            <section>
              <SectionTitle
                eyebrow="Etapa 3"
                title="Bomboniere & snacks"
                hint="Entrega na sua fileira"
              />
              <Concessions quantities={quantities} onChange={changeQty} />
            </section>
          )}

          {step === 4 && (
            <section>
              <SectionTitle
                eyebrow="Etapa 4"
                title="Pagamento"
                hint={`${seats.length} ingresso(s) · ${snackLines.length} item(ns)`}
              />
              <Payment
                method={method}
                onMethod={setMethod}
                pixPayload={pixPayload}
                total={grandTotal}
                card={card}
                onCard={(patch) => setCard((c) => ({ ...c, ...patch }))}
              />
            </section>
          )}

          {step === 5 && movie && showtime && (
            <section>
              <SectionTitle
                eyebrow="Etapa 5"
                title="Seu ingresso digital"
                hint="Apresente o QR Code na entrada"
              />
              <Voucher
                code={code}
                movie={movie}
                format={activeFormat}
                showtime={showtime}
                seats={seats}
                snackLines={snackLines}
                total={grandTotal}
              />
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-44 lg:h-fit">
          <OrderSidebar
            step={step}
            lines={sidebarLines}
            total={grandTotal}
            canAdvance={canAdvance}
            nextLabel={nextLabel}
            hint={hint}
            onBack={() => setStep((s) => Math.max(1, s - 1))}
            onNext={goNext}
          />
        </aside>
      </main>
    </div>
  );
}

function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h;
}

function CanvasFallback() {
  return (
    <div className="grid h-full w-full place-items-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
      Ligando o projetor…
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  hint,
}: {
  eyebrow: string;
  title: string;
  hint: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <p className="text-[11px] uppercase tracking-[0.4em] text-primary">{eyebrow}</p>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
