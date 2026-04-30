"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, Plus, BookOpen } from "lucide-react";
import type { BoardData } from "@/lib/types";
import { Column } from "./Column";
import { CreateCardModal } from "./CreateCardModal";

export function Board({ id, title, columns }: BoardData) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <header className="shrink-0 px-8 pt-8 pb-6 animate-fade-in">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-parchment-700" strokeWidth={1.5} />
            <h1 className="font-display text-xl font-semibold text-parchment-800">
              {title}
            </h1>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-body font-medium text-parchment-500 hover:text-terracotta transition-colors"
          >
            <Plus size={13} strokeWidth={2} />
            New Card
          </button>

          <Link
            href="/ponderings"
            className="flex items-center gap-1.5 text-xs font-body font-medium text-parchment-500 hover:text-terracotta transition-colors"
          >
            <BookOpen size={13} strokeWidth={1.5} />
            Ponderings
          </Link>

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

      <CreateCardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        boardId={id}
        columns={columns}
      />
    </div>
  );
}
