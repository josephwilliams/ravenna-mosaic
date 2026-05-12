"use client";

import { useState, useCallback } from "react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import type { BoardData, CardData } from "@/lib/types";
import { fetchJSON } from "@/lib/fetch";
import { Column } from "./Column";
import { BoardHeader } from "./BoardHeader";
import { CreateCardModal } from "./CreateCardModal";
import { EditColumnModal } from "./EditColumnModal";
import { useBoardKeyboard } from "@/hooks/useBoardKeyboard";
import { useBoardFilters } from "@/hooks/useBoardFilters";

export function Board({ id, title, columns: initialColumns }: BoardData) {
  const [columns, setColumns] = useState(initialColumns);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalColumnId, setModalColumnId] = useState<string | undefined>();
  const [editingColumn, setEditingColumn] = useState<{ id: string; title: string; cardCount: number } | null>(null);

  const filters = useBoardFilters(id, columns);

  useBoardKeyboard(filters.filteredColumns);

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

      if (filters.hasFilters) {
        const filteredDest = destCol.cards.filter((card) => {
          if (filters.activePriorities.length > 0 && !filters.activePriorities.includes(card.priority)) return false;
          if (filters.activeTagIds.length > 0 && !card.tags.some(({ tag }) => filters.activeTagIds.includes(tag.id))) return false;
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
    [columns, id, filters.hasFilters, filters.activePriorities, filters.activeTagIds]
  );

  function openNewCard(colId?: string) {
    setModalColumnId(colId);
    setModalOpen(true);
  }

  return (
    <div className="h-full flex flex-col">
      <BoardHeader
        boardId={id}
        title={title}
        availableTags={filters.availableTags}
        activePriorities={filters.activePriorities}
        activeTagIds={filters.activeTagIds}
        groupByUrgency={filters.groupByUrgency}
        onNewCard={() => openNewCard()}
        onTogglePriority={filters.togglePriority}
        onToggleTag={filters.toggleTag}
        onToggleGroupByUrgency={() => filters.sortByUrgency(setColumns)}
        onClearFilters={filters.clearFilters}
        onEditColumn={setEditingColumn}
      />

      <main className="flex-1 overflow-x-auto px-6 md:px-8 pb-6 md:pb-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="column" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-5 h-full after:shrink-0 after:w-px after:content-['']"
              >
                {filters.filteredColumns.map((col, i) => (
                  <Column key={col.id} {...col} index={i} boardId={id} onEdit={setEditingColumn} onLoadMore={loadMore} onAddCard={(colId) => openNewCard(colId)} />
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
