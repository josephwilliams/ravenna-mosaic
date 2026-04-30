"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Settings } from "lucide-react";
import type { ColumnData } from "@/lib/types";
import { Surface } from "./Surface";
import { Card } from "./Card";

interface ColumnProps extends ColumnData {
  index: number;
  boardId: string;
  onEdit: (col: { id: string; title: string; cardCount: number }) => void;
}

export function Column({ id, title, cards, index, boardId, onEdit }: ColumnProps) {
  return (
    <Draggable draggableId={`col-${id}`} index={index}>
      {(colProvided) => (
        <div
          ref={colProvided.innerRef}
          {...colProvided.draggableProps}
          className="shrink-0"
        >
          <Surface
            className="flex flex-col min-w-[300px] max-w-[340px] w-[340px] animate-slide-up"
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
                    {cards.length}
                  </span>
                  <button
                    onClick={() => onEdit({ id, title, cardCount: cards.length })}
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
