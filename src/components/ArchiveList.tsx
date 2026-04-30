"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Tile } from "./Surface";
import { PriorityBadge } from "./PriorityBadge";
import { TagChip } from "./TagChip";
import type { Priority, TagData } from "@/lib/types";

interface ArchivedCard {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  columnId: string;
  column: { id: string; title: string; boardId: string };
  tags: { tag: TagData }[];
  deletedAt: Date | null;
}

export function ArchiveList({ cards: initial }: { cards: ArchivedCard[] }) {
  const [cards, setCards] = useState(initial);

  async function restore(card: ArchivedCard) {
    const res = await fetch(
      `/api/boards/${card.column.boardId}/columns/${card.columnId}/cards/${card.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deletedAt: null }),
      }
    );
    if (res.ok) {
      setCards((prev) => prev.filter((c) => c.id !== card.id));
    }
  }

  if (cards.length === 0) {
    return (
      <p className="text-sm text-parchment-400 font-body italic py-8 text-center">
        The archive is empty.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {cards.map((card, i) => (
        <Tile
          key={card.id}
          className="px-4 py-3 animate-tile-in"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-body font-medium text-parchment-400 uppercase tracking-wider">
                  {card.column.title}
                </span>
                <PriorityBadge priority={card.priority} />
              </div>
              <h3 className="font-body text-sm font-medium text-parchment-800 leading-snug">
                {card.title}
              </h3>
              {card.description && (
                <p className="mt-1 text-xs text-parchment-500 leading-relaxed line-clamp-2">
                  {card.description}
                </p>
              )}
              {card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {card.tags.map(({ tag }) => (
                    <TagChip key={tag.id} name={tag.name} color={tag.color} />
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => restore(card)}
              className="shrink-0 p-1.5 text-parchment-400 hover:text-sage transition-colors"
              title="Restore to board"
            >
              <RotateCcw size={14} strokeWidth={1.5} />
            </button>
          </div>
        </Tile>
      ))}
    </div>
  );
}
