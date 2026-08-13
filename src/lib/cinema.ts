export type FormatId = "standard" | "imax" | "screenx";

export type Format = {
  id: FormatId;
  name: string;
  blurb: string;
  price: number;
};

export const FORMATS: Format[] = [
  { id: "standard", name: "Standard", blurb: "Flat screen · Dolby 7.1", price: 14 },
  { id: "imax", name: "IMAX Curved", blurb: "Curved 1.43:1 · 12ch", price: 22 },
  { id: "screenx", name: "ScreenX 270°", blurb: "Side-wall projection", price: 28 },
];

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
  category: "Popcorn" | "Drinks" | "Combos" | "Candy";
  emoji: string;
};

export const SNACKS: SnackItem[] = [
  { id: "pop-s", name: "Classic Butter", desc: "Small popcorn · 90g", price: 6.5, category: "Popcorn", emoji: "🍿" },
  { id: "pop-l", name: "Truffle Grande", desc: "Large popcorn · 220g", price: 11, category: "Popcorn", emoji: "🍿" },
  { id: "drk-c", name: "Cola Zero", desc: "700ml chilled", price: 5.5, category: "Drinks", emoji: "🥤" },
  { id: "drk-s", name: "Craft Lemonade", desc: "500ml, real citrus", price: 7, category: "Drinks", emoji: "🍋" },
  { id: "cmb-1", name: "Duo Night", desc: "2 drinks + large popcorn", price: 19.5, category: "Combos", emoji: "🎬" },
  { id: "cmb-2", name: "VR Feast", desc: "Nachos, combo drink, candy", price: 26, category: "Combos", emoji: "🌮" },
  { id: "cnd-1", name: "Dark Choc Bites", desc: "70% cacao · 120g", price: 4.5, category: "Candy", emoji: "🍫" },
  { id: "cnd-2", name: "Sour Nebula", desc: "Sour gummies · 150g", price: 4, category: "Candy", emoji: "🍬" },
];

export const SNACK_CATEGORIES = ["Popcorn", "Drinks", "Combos", "Candy"] as const;

export const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
