"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Flame, Plus, Columns3, BookOpen, Archive, Tag } from "lucide-react";
import type { BoardData, CardData, Priority, TagData } from "@/lib/types";
import { navItemClass } from "@/lib/styles";
import { fetchJSON } from "@/lib/fetch";
import { Column } from "./Column";
import { CreateCardModal } from "./CreateCardModal";
import { CreateColumnModal } from "./CreateColumnModal";
import { EditColumnModal } from "./EditColumnModal";
import { TagsModal } from "./TagsModal";
import { FilterBar } from "./FilterBar";
import { MobileNav } from "./MobileNav";
import { useBoardKeyboard } from "@/hooks/useBoardKeyboard";

export function Board({ id, title, columns: initialColumns }: BoardData) {
  const [columns, setColumns] = useState(initialColumns);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalColumnId, setModalColumnId] = useState<string | undefined>();
  const [colModalOpen, setColModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<{ id: string; title: string; cardCount: number } | null>(null);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [activePriorities, setActivePriorities] = useState<Priority[]>([]);
  const [activeTagIds, setActiveTagIds] = useState<string[]>([]);
  const [groupByUrgency, setGroupByUrgency] = useState(false);

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

  useBoardKeyboard(filteredColumns);

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

  const priorityRank: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

  async function sortByUrgency() {
    const sorted = columns.map((col) => ({
      ...col,
      cards: [...col.cards]
        .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
        .map((c, i) => ({ ...c, position: i })),
    }));
    setColumns(sorted);
    setGroupByUrgency(true);

    await Promise.all(
      sorted.map((col) =>
        fetchJSON(`/api/boards/${id}/columns/${col.id}/cards/reorder`, {
          method: "PATCH",
          body: { cardIds: col.cards.map((c) => c.id) },
        })
      )
    );
  }

  function clearFilters() {
    setActivePriorities([]);
    setActiveTagIds([]);
    setGroupByUrgency(false);
  }

  async function loadMore(columnId: string, skip: number) {
    const { data } = await fetchJSON<CardData[]>(`/api/boards/${id}/columns/${columnId}/cards?skip=${skip}&take=5`);
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, ...data] }
          : col
      )
    );
  }

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId, type } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      if (type === "column") {
        const newColumns = [...columns];
        const [moved] = newColumns.splice(source.index, 1);
        newColumns.splice(destination.index, 0, moved);
        newColumns.forEach((c, i) => (c.position = i));
        setColumns(newColumns);

        await fetchJSON(`/api/boards/${id}/columns/reorder`, {
          method: "PATCH",
          body: { columnId: moved.id, position: destination.index },
        });
        return;
      }

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

      if (sourceCol.id !== destCol.id) {
        sourceCol.totalCards--;
        destCol.totalCards++;
      }

      setColumns(newColumns);

      await fetchJSON(`/api/cards/${draggableId}/move`, {
        method: "PATCH",
        body: { columnId: destination.droppableId, position: moved.position },
      });
    },
    [columns, id, hasFilters, activePriorities, activeTagIds]
  );

  return (
    <div className="h-full flex flex-col">
      <header className="shrink-0 px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 animate-fade-in">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-parchment-700" strokeWidth={1.5} />
            <h1 className="font-display text-xl font-semibold text-parchment-800">
              {title}
            </h1>
          </div>

          <button
            onClick={() => { setModalColumnId(undefined); setModalOpen(true); }}
            className={navItemClass}
          >
            <Plus size={13} strokeWidth={2} />
            New Card
          </button>

          <button
            onClick={() => setColModalOpen(true)}
            className={navItemClass}
          >
            <Columns3 size={13} strokeWidth={1.5} />
            New Column
          </button>

          <button
            onClick={() => setTagsOpen(true)}
            className={navItemClass}
          >
            <Tag size={13} strokeWidth={1.5} />
            Tags
          </button>

          <Link
            href="/archive"
            className={navItemClass}
          >
            <Archive size={13} strokeWidth={1.5} />
            Archive
          </Link>

          <Link
            href="/ponderings"
            className={navItemClass}
          >
            <BookOpen size={13} strokeWidth={1.5} />
            Ponderings
          </Link>

          <div className="h-px flex-1 bg-gradient-to-r from-parchment-300 to-transparent" />

          <MobileNav
            onNewCard={() => { setModalColumnId(undefined); setModalOpen(true); }}
            onNewColumn={() => setColModalOpen(true)}
            onTags={() => setTagsOpen(true)}
          />
        </div>

        {availableTags.length > 0 && (
          <div className="mt-4">
            <FilterBar
              availableTags={availableTags}
              activePriorities={activePriorities}
              activeTagIds={activeTagIds}
              groupByUrgency={groupByUrgency}
              onTogglePriority={togglePriority}
              onToggleTag={toggleTag}
              onToggleGroupByUrgency={sortByUrgency}
              onClear={clearFilters}
            />
          </div>
        )}
      </header>

      <main className="flex-1 overflow-x-auto px-6 md:px-8 pb-6 md:pb-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="column" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-5 h-full after:shrink-0 after:w-px after:content-['']"
              >
                {filteredColumns.map((col, i) => (
                  <Column key={col.id} {...col} index={i} boardId={id} onEdit={setEditingColumn} onLoadMore={loadMore} onAddCard={(colId) => { setModalColumnId(colId); setModalOpen(true); }} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>

      <CreateCardModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setModalColumnId(undefined); }}
        boardId={id}
        columns={columns}
        defaultColumnId={modalColumnId}
      />

      <TagsModal
        open={tagsOpen}
        onClose={() => setTagsOpen(false)}
      />

      <CreateColumnModal
        open={colModalOpen}
        onClose={() => setColModalOpen(false)}
        boardId={id}
        onCreated={() => window.location.reload()}
      />

      {editingColumn && (
        <EditColumnModal
          open
          onClose={() => setEditingColumn(null)}
          boardId={id}
          column={editingColumn}
          onUpdated={() => window.location.reload()}
        />
      )}
    </div>
  );
}
