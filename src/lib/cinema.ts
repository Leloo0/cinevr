import poster1 from "@/assets/poster-1.jpg";
import poster2 from "@/assets/poster-2.jpg";
import poster3 from "@/assets/poster-3.jpg";
import poster4 from "@/assets/poster-4.jpg";

export type FormatId = "standard" | "imax" | "screenx";

export type Format = {
  id: FormatId;
  name: string;
  blurb: string;
  price: number;
};

export const FORMATS: Format[] = [
  { id: "standard", name: "Standard", blurb: "Tela plana · Dolby 7.1", price: 32 },
  { id: "imax", name: "IMAX Curvado", blurb: "Tela curva 1.43:1 · 12 canais", price: 48 },
  { id: "screenx", name: "ScreenX 270°", blurb: "Projeção nas paredes laterais", price: 56 },
];

export type Movie = {
  id: string;
  title: string;
  synopsis: string;
  rating: string;
  genre: string;
  duration: string;
  poster: string;
};

export const MOVIES: Movie[] = [
  {
    id: "orbita",
    title: "Órbita Carmesim",
    synopsis:
      "Uma tripulação isolada descobre que o planeta vermelho que orbitam não está tão vazio quanto parecia.",
    rating: "14",
    genre: "Ficção Científica",
    duration: "2h 18min",
    poster: poster1,
  },
  {
    id: "neon",
    title: "Chuva de Neon",
    synopsis:
      "Um detetive insone persegue um assassino que só age nas madrugadas encharcadas da cidade baixa.",
    rating: "16",
    genre: "Suspense Noir",
    duration: "1h 54min",
    poster: poster2,
  },
  {
    id: "mansao",
    title: "A Mansão Escarlate",
    synopsis:
      "Cinco herdeiros passam a noite na casa da família. Ao amanhecer, a casa decide quem sai.",
    rating: "18",
    genre: "Terror",
    duration: "1h 41min",
    poster: poster3,
  },
  {
    id: "asfalto",
    title: "Asfalto Vermelho",
    synopsis:
      "Corridas clandestinas, dívidas impagáveis e um último pedágio a ser cobrado em alta velocidade.",
    rating: "12",
    genre: "Ação",
    duration: "2h 05min",
    poster: poster4,
  },
];

export const SHOWTIMES = ["14:30", "18:00", "21:15"] as const;
export type Showtime = (typeof SHOWTIMES)[number];

export const ROWS = ["A", "B", "C", "D", "E", "F", "G"] as const;
export const COLS = 10;

// Deterministic occupied seats (no randomness at module scope).
export const OCCUPIED = new Set([
  "A3", "A4", "B7", "C1", "C2", "C9", "D5", "D6", "E8", "F2", "F3", "F4", "G10", "B10",
]);

export type SnackItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: "Pipocas" | "Bebidas" | "Combos" | "Doces";
  icon: "popcorn" | "cup" | "combo" | "candy";
};

export const SNACKS: SnackItem[] = [
  { id: "pop-s", name: "Pipoca Manteiga", desc: "Balde pequeno · 90g", price: 18, category: "Pipocas", icon: "popcorn" },
  { id: "pop-l", name: "Pipoca Trufada", desc: "Balde grande · 220g", price: 32, category: "Pipocas", icon: "popcorn" },
  { id: "drk-c", name: "Refrigerante Zero", desc: "700ml gelado", price: 14, category: "Bebidas", icon: "cup" },
  { id: "drk-s", name: "Limonada Artesanal", desc: "500ml, limão siciliano", price: 19, category: "Bebidas", icon: "cup" },
  { id: "cmb-1", name: "Combo Casal", desc: "2 bebidas + pipoca grande", price: 58, category: "Combos", icon: "combo" },
  { id: "cmb-2", name: "Combo VR Feast", desc: "Nachos, bebida e doce", price: 72, category: "Combos", icon: "combo" },
  { id: "cnd-1", name: "Chocolate 70%", desc: "Barra intensa · 120g", price: 15, category: "Doces", icon: "candy" },
  { id: "cnd-2", name: "Balas Azedas", desc: "Gomas sortidas · 150g", price: 12, category: "Doces", icon: "candy" },
];

export const SNACK_CATEGORIES = ["Pipocas", "Bebidas", "Combos", "Doces"] as const;

export const BOOKING_FEE_PER_SEAT = 3.5;

export const currency = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const STEPS = [
  { id: 1, label: "Sessão" },
  { id: 2, label: "Assentos" },
  { id: 3, label: "Bomboniere" },
  { id: 4, label: "Pagamento" },
  { id: 5, label: "Ingresso" },
] as const;
