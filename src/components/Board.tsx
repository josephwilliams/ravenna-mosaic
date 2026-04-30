"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Flame, Plus, BookOpen, Archive, Tag } from "lucide-react";
import type { BoardData, ColumnData, CardData, Priority, TagData } from "@/lib/types";
import { Column } from "./Column";
import { CreateCardModal } from "./CreateCardModal";
import { TagsModal } from "./TagsModal";
import { FilterBar } from "./FilterBar";

export function Board({ id, title, columns: initialColumns }: BoardData) {
  const [columns, setColumns] = useState(initialColumns);
  const [modalOpen, setModalOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [activePriorities, setActivePriorities] = useState<Priority[]>([]);
  const [activeTagIds, setActiveTagIds] = useState<string[]>([]);

  const availableTags = useMemo(() => {
    const tagMap = new Map<string, TagData>();
    for (const col of columns) {
      for (const card of col.cards) {
        for (const { tag } of card.tags) {
          tagMap.set(tag.id, tag);
        }
      }
    }
    return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [columns]);

  const hasFilters = activePriorities.length > 0 || activeTagIds.length > 0;

  const filteredColumns = useMemo(() => {
    if (!hasFilters) return columns;
    return columns.map((col) => ({
      ...col,
      cards: col.cards.filter((card) => {
        if (activePriorities.length > 0 && !activePriorities.includes(card.priority)) return false;
        if (activeTagIds.length > 0 && !card.tags.some(({ tag }) => activeTagIds.includes(tag.id))) return false;
        return true;
      }),
    }));
  }, [columns, activePriorities, activeTagIds, hasFilters]);

  function togglePriority(p: Priority) {
    setActivePriorities((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  function toggleTag(id: string) {
    setActiveTagIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function clearFilters() {
    setActivePriorities([]);
    setActiveTagIds([]);
  }

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      const newColumns = columns.map((col) => ({ ...col, cards: [...col.cards] }));
      const sourceCol = newColumns.find((c) => c.id === source.droppableId)!;
      const destCol = newColumns.find((c) => c.id === destination.droppableId)!;

      const cardIndex = sourceCol.cards.findIndex((c) => c.id === draggableId);
      const [moved] = sourceCol.cards.splice(cardIndex, 1);

      if (hasFilters) {
        const filteredDest = destCol.cards.filter((card) => {
          if (activePriorities.length > 0 && !activePriorities.includes(card.priority)) return false;
          if (activeTagIds.length > 0 && !card.tags.some(({ tag }) => activeTagIds.includes(tag.id))) return false;
          return true;
        });
        const anchorCard = filteredDest[destination.index];
        const realIndex = anchorCard
          ? destCol.cards.findIndex((c) => c.id === anchorCard.id)
          : destCol.cards.length;
        destCol.cards.splice(realIndex, 0, moved);
      } else {
        destCol.cards.splice(destination.index, 0, moved);
      }

      sourceCol.cards.forEach((c, i) => (c.position = i));
      destCol.cards.forEach((c, i) => (c.position = i));

      setColumns(newColumns);

      await fetch(`/api/cards/${draggableId}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          columnId: destination.droppableId,
          position: moved.position,
        }),
      });
    },
    [columns, hasFilters, activePriorities, activeTagIds]
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

          <button
            onClick={() => setTagsOpen(true)}
            className="flex items-center gap-1.5 text-xs font-body font-medium text-parchment-500 hover:text-terracotta transition-colors"
          >
            <Tag size={13} strokeWidth={1.5} />
            Tags
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
        </div>

        {availableTags.length > 0 && (
          <div className="mt-4">
            <FilterBar
              availableTags={availableTags}
              activePriorities={activePriorities}
              activeTagIds={activeTagIds}
              onTogglePriority={togglePriority}
              onToggleTag={toggleTag}
              onClear={clearFilters}
            />
          </div>
        )}
      </header>

      <main className="flex-1 overflow-x-auto px-8 pb-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-5 h-full">
            {filteredColumns.map((col, i) => (
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

      <TagsModal
        open={tagsOpen}
        onClose={() => setTagsOpen(false)}
      />
    </div>
  );
}
