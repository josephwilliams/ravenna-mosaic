"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Flame, Plus, BookOpen, Archive } from "lucide-react";
import type { BoardData, ColumnData, CardData } from "@/lib/types";
import { Column } from "./Column";
import { CreateCardModal } from "./CreateCardModal";

export function Board({ id, title, columns: initialColumns }: BoardData) {
  const [columns, setColumns] = useState(initialColumns);
  const [modalOpen, setModalOpen] = useState(false);

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      // Optimistic update
      const newColumns = columns.map((col) => ({ ...col, cards: [...col.cards] }));
      const sourceCol = newColumns.find((c) => c.id === source.droppableId)!;
      const destCol = newColumns.find((c) => c.id === destination.droppableId)!;

      const [moved] = sourceCol.cards.splice(source.index, 1);
      destCol.cards.splice(destination.index, 0, moved);

      // Recalculate positions
      sourceCol.cards.forEach((c, i) => (c.position = i));
      destCol.cards.forEach((c, i) => (c.position = i));

      setColumns(newColumns);

      // Persist
      await fetch(`/api/cards/${draggableId}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          columnId: destination.droppableId,
          position: destination.index,
        }),
      });
    },
    [columns]
  );

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
            href="/archive"
            className="flex items-center gap-1.5 text-xs font-body font-medium text-parchment-500 hover:text-terracotta transition-colors"
          >
            <Archive size={13} strokeWidth={1.5} />
            Archive
          </Link>

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
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-5 h-full">
            {columns.map((col, i) => (
              <Column key={col.id} {...col} index={i} boardId={id} />
            ))}
          </div>
        </DragDropContext>
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
