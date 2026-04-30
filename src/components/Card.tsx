"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Draggable } from "@hello-pangea/dnd";
import { Settings, MessageSquare } from "lucide-react";
import type { CardData } from "@/lib/types";
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
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const commentCount = card._count?.comments ?? 0;

  useEffect(() => { setMounted(true); }, []);

  function handleCardClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest("button")) return;
    router.push(`/cards/${card.id}`);
  }

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => {
          const node = (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onClick={handleCardClick}
              className={`relative bg-white border rounded-tile shadow-tile cursor-pointer transition-all duration-200 ease-out-expo px-4 py-3 ${
                snapshot.isDragging
                  ? "shadow-tile-hover border-parchment-300 rotate-[1deg] scale-[1.02]"
                  : "border-parchment-200 hover:shadow-tile-hover hover:-translate-y-0.5 hover:border-parchment-300 hover:z-10"
              }`}
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

              <div className="flex items-center justify-between mt-2">
                {card.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {card.tags.map(({ tag }) => (
                      <TagChip key={tag.id} name={tag.name} color={tag.color} />
                    ))}
                  </div>
                ) : (
                  <div />
                )}

                {commentCount > 0 && (
                  <div className="flex items-center gap-1 text-parchment-400">
                    <MessageSquare size={12} strokeWidth={1.5} />
                    <span className="text-[10px] font-body font-medium">{commentCount}</span>
                  </div>
                )}
              </div>
            </div>
          );

          if (snapshot.isDragging && mounted) {
            return createPortal(node, document.body);
          }
          return node;
        }}
      </Draggable>

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
