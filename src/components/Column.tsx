"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Settings, ChevronDown, Plus } from "lucide-react";
import type { ColumnData } from "@/lib/types";
import { Surface } from "./Surface";
import { Card } from "./Card";

interface ColumnProps extends ColumnData {
  index: number;
  boardId: string;
  onEdit: (col: { id: string; title: string; cardCount: number }) => void;
  onLoadMore: (columnId: string, skip: number) => void;
  onAddCard: (columnId: string) => void;
}

export function Column({ id, title, cards, totalCards, index, boardId, onEdit, onLoadMore, onAddCard }: ColumnProps) {
  const hasMore = cards.length < totalCards;

  return (
    <Draggable draggableId={`col-${id}`} index={index}>
      {(colProvided) => (
        <div
          ref={colProvided.innerRef}
          {...colProvided.draggableProps}
          className="shrink-0 h-full"
        >
          <Surface
            className="flex flex-col min-w-[300px] max-w-[340px] w-[340px] h-full animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
            data-column-index={index}
          >
            <div
              {...colProvided.dragHandleProps}
              className="px-5 pt-5 pb-3 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-parchment-500">
                  {title}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-body font-medium text-parchment-400 tabular-nums">
                    {totalCards}
                  </span>
                  <button
                    onClick={() => onAddCard(id)}
                    className="text-parchment-400 hover:text-parchment-700 transition-colors"
                  >
                    <Plus size={12} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => onEdit({ id, title, cardCount: totalCards })}
                    className="text-parchment-400 hover:text-parchment-700 transition-colors"
                  >
                    <Settings size={12} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="h-px mt-3 bg-gradient-to-r from-parchment-300 to-transparent" />
            </div>

            <Droppable droppableId={id} type="card">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 overflow-y-auto px-3 pb-3 space-y-2 transition-colors duration-200 ${
                    snapshot.isDraggingOver ? "bg-parchment-200/40 rounded-b-surface" : ""
                  }`}
                >
                  {cards.map((card, i) => (
                    <Card key={card.id} {...card} index={i} boardId={boardId} columnId={id} />
                  ))}

                  {provided.placeholder}

                  {hasMore && (
                    <button
                      onClick={() => onLoadMore(id, cards.length)}
                      className="flex items-center justify-center gap-1 w-full py-2 text-xs font-body font-medium text-parchment-400 hover:text-terracotta transition-colors"
                    >
                      <ChevronDown size={12} strokeWidth={1.5} />
                      Show more ({totalCards - cards.length})
                    </button>
                  )}

                  {cards.length === 0 && !snapshot.isDraggingOver && (
                    <div className="flex items-center justify-center py-12 text-parchment-400 text-xs font-body italic">
                      No cards
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </Surface>
        </div>
      )}
    </Draggable>
  );
}
