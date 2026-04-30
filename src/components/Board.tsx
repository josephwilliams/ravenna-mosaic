"use client";

import type { BoardData } from "@/lib/types";
import { Column } from "./Column";

export function Board({ title, columns }: BoardData) {
  return (
    <div className="h-full flex flex-col">
      <header className="shrink-0 px-8 pt-8 pb-6 animate-fade-in">
        <div className="flex items-baseline gap-5">
          <h1 className="font-display text-xl font-semibold text-parchment-800">
            {title}
          </h1>
          <div className="h-px flex-1 bg-gradient-to-r from-parchment-300 to-transparent" />
          <span className="font-display text-sm font-normal text-parchment-400">
            Mosaic
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto px-8 pb-8">
        <div className="flex gap-5 h-full">
          {columns.map((col, i) => (
            <Column key={col.id} {...col} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
