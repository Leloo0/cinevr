import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import { Clapperboard, Sparkles, Ticket } from "lucide-react";
import { SeatMap } from "@/components/cinema/SeatMap";
import { Concessions } from "@/components/cinema/Concessions";
import { FORMATS, SNACKS, currency, type FormatId } from "@/lib/cinema";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TheaterScene = lazy(() => import("@/components/cinema/TheaterScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CINE-VR · Interstellar Special Edition Tickets" },
      {
        name: "description",
        content:
          "Pick your seat in a live 3D theater preview, choose IMAX or ScreenX 270°, add concessions and check out in seconds.",
      },
      { property: "og:title", content: "CINE-VR · Interstellar Special Edition Tickets" },
      {
        property: "og:description",
        content:
          "3D sensory seat preview, IMAX & ScreenX formats, and concessions — book your cinema night with CINE-VR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [format, setFormat] = useState<FormatId>("imax");
  const [seats, setSeats] = useState<string[]>([]);
  const [focusSeat, setFocusSeat] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [purchased, setPurchased] = useState(false);

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
  const fees = seats.length > 0 ? 2.5 : 0;
  const grandTotal = ticketsTotal + snacksTotal + fees;

  return (
    <div className="min-h-screen hero-veil">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-4">
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
              Interstellar: <span className="text-gradient-red">Special Edition</span>
            </h1>
            <p className="text-xs text-muted-foreground">Today · 21:40 · Hall 07</p>
          </div>

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
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          <section>
            <SectionTitle
              eyebrow="Sensory Preview"
              title="Your view from the seat"
              hint={
                focusSeat
                  ? `Camera locked to seat ${focusSeat}`
                  : "Select a seat to move the camera"
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
              eyebrow="Seating"
              title="Choose your seats"
              hint={`Rows A–G · ${currency(activeFormat.price)} per seat`}
            />
            <SeatMap selected={seats} onToggle={toggleSeat} />
          </section>

          <section>
            <SectionTitle eyebrow="Concessions" title="Snacks & drinks" hint="Served to your row" />
            <Concessions quantities={quantities} onChange={changeQty} />
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="glass rounded-2xl p-5">
            <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Your order</h2>

            <div className="mt-4 space-y-3 text-sm">
              <Line label="Format" value={activeFormat.name} />
              <Line
                label={`Seats (${seats.length})`}
                value={seats.length ? [...seats].sort().join(", ") : "None selected"}
              />
              <Line label="Tickets" value={currency(ticketsTotal)} />

              {snackLines.length > 0 && (
                <div className="space-y-2 border-t border-border pt-3">
                  {snackLines.map((l) => (
                    <Line key={l.id} label={`${l.qty}× ${l.name}`} value={currency(l.total)} />
                  ))}
                </div>
              )}

              <Line label="Booking fee" value={currency(fees)} />
            </div>

            <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Grand total
              </span>
              <span className="font-display text-2xl font-bold text-gradient-red">
                {currency(grandTotal)}
              </span>
            </div>

            <button
              type="button"
              disabled={seats.length === 0}
              onClick={() => {
                setPurchased(false);
                setConfirmOpen(true);
              }}
              className="glow-red mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              <Ticket className="h-4 w-4" />
              Finalize purchase
            </button>
            {seats.length === 0 && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Select at least one seat to continue
              </p>
            )}
          </div>
        </aside>
      </main>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="border-primary/30 bg-popover">
          <DialogHeader>
            <DialogTitle className="font-display">
              {purchased ? "Enjoy the show" : "Confirm your booking"}
            </DialogTitle>
            <DialogDescription>
              {purchased
                ? `Tickets for ${[...seats].sort().join(", ")} are reserved. Show this screen at Hall 07.`
                : `${seats.length} seat(s) in ${activeFormat.name}, ${snackLines.length} concession item(s).`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between rounded-xl border border-primary/30 px-4 py-3">
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Total</span>
            <span className="font-display text-xl font-bold text-gradient-red">
              {currency(grandTotal)}
            </span>
          </div>

          <DialogFooter>
            {purchased ? (
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="glow-red w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground"
              >
                Done
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setPurchased(true)}
                  className="glow-red rounded-xl bg-primary px-4 py-2.5 text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground"
                >
                  Pay {currency(grandTotal)}
                </button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CanvasFallback() {
  return (
    <div className="grid h-full w-full place-items-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
      Booting projector…
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

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
