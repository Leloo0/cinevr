import { Clock, Star } from "lucide-react";
import { MOVIES, SHOWTIMES, type Movie, type Showtime } from "@/lib/cinema";
import { cn } from "@/lib/utils";

type Props = {
  movieId: string | null;
  showtime: Showtime | null;
  onSelect: (movie: Movie, time: Showtime) => void;
  onSelectMovie: (movie: Movie) => void;
};

export function MoviePicker({ movieId, showtime, onSelect, onSelectMovie }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {MOVIES.map((m) => {
        const active = movieId === m.id;
        return (
          <article
            key={m.id}
            className={cn(
              "glass overflow-hidden rounded-2xl transition-all duration-300",
              active && "glow-red",
            )}
          >
            <button
              type="button"
              onClick={() => onSelectMovie(m)}
              className="block w-full text-left"
            >
              <img
                src={m.poster}
                alt={`Cartaz do filme ${m.title}`}
                loading="lazy"
                width={640}
                height={960}
                className="aspect-[2/3] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
            </button>
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold leading-tight">{m.title}</h3>
                <span className="shrink-0 rounded-md border border-primary/40 px-1.5 py-0.5 text-[11px] font-bold text-primary">
                  {m.rating}
                </span>
              </div>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-primary" /> {m.genre}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {m.duration}
                </span>
              </p>
              <p className="line-clamp-3 text-sm text-muted-foreground">{m.synopsis}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {SHOWTIMES.map((t) => {
                  const on = active && showtime === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onSelect(m, t)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-300",
                        on
                          ? "glow-red border-transparent bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground",
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
