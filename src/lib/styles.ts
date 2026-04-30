import type { Priority } from "./types";

export const inputClass =
  "w-full bg-white border border-parchment-200 rounded-tile px-4 py-2.5 text-sm font-body text-parchment-800 placeholder:text-parchment-400 focus:outline-none focus:border-parchment-400 focus:ring-1 focus:ring-parchment-300 transition-colors";

export const selectClass =
  "bg-white border border-parchment-200 rounded-tile px-3 py-2 text-sm font-body text-parchment-700 focus:outline-none focus:border-parchment-400 focus:ring-1 focus:ring-parchment-300 transition-colors";

export const btnPrimary =
  "px-5 py-2 text-xs font-body font-semibold text-parchment-50 bg-parchment-800 rounded-tile hover:bg-parchment-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors";

export const btnSecondary =
  "px-4 py-2 text-xs font-body font-medium text-parchment-500 hover:text-parchment-700 transition-colors";

export const priorities: { value: Priority; label: string }[] = [
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

export const navItemClass =
  "hidden md:flex items-center gap-1.5 text-xs font-body font-medium text-parchment-500 hover:text-terracotta transition-colors";

export const backLinkClass =
  "flex items-center gap-1.5 text-xs font-body font-medium text-parchment-400 hover:text-terracotta transition-colors";
