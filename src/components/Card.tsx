"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import type { CardData } from "@/lib/types";
import { Tile } from "./Surface";
import { PriorityBadge, PriorityBar } from "./PriorityBadge";
import { TagChip } from "./TagChip";
import { EditCardModal } from "./EditCardModal";

interface CardProps extends CardData {
  index: number;
  boardId: string;
  columnId: string;
}

export function Card({ index, boardId, columnId, ...card }: CardProps) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <Tile
        className="px-4 py-3 cursor-default animate-tile-in"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <PriorityBar priority={card.priority} />

        <div className="flex items-start justify-between gap-2">
          <h3 className="font-body text-sm font-medium text-parchment-800 leading-snug">
            {card.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <PriorityBadge priority={card.priority} />
            <button
              onClick={() => setEditing(true)}
              className="p-0.5 text-parchment-500 hover:text-parchment-800 transition-colors"
            >
              <Settings size={13} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {card.description && (
          <p className="mt-1.5 text-xs text-parchment-500 leading-relaxed line-clamp-2">
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
      </Tile>

      <EditCardModal
        open={editing}
        onClose={() => setEditing(false)}
        card={card}
        boardId={boardId}
        columnId={columnId}
      />
    </>
  );
}
