import { useState, useEffect, useMemo } from "react";
import type { Priority, TagData, ColumnData } from "@/lib/types";
import { fetchJSON } from "@/lib/fetch";

export function useBoardFilters(boardId: string, columns: ColumnData[]) {
  const [activePriorities, setActivePriorities] = useState<Priority[]>([]);
  const [activeTagIds, setActiveTagIds] = useState<string[]>([]);
  const [groupByUrgency, setGroupByUrgency] = useState(false);
  const [availableTags, setAvailableTags] = useState<(TagData & { cardCount: number })[]>([]);

  useEffect(() => {
    fetchJSON<{ id: string; name: string; color: string; _count: { cards: number } }[]>("/api/tags")
      .then(({ data }) =>
        setAvailableTags(
          data
            .map((t) => ({ id: t.id, name: t.name, color: t.color, cardCount: t._count.cards }))
            .sort((a, b) => b.cardCount - a.cardCount)
        )
      );
  }, []);

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

  const priorityRank: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

  async function sortByUrgency(setColumns: (fn: (cols: ColumnData[]) => ColumnData[]) => void) {
    const sorted = columns.map((col) => ({
      ...col,
      cards: [...col.cards]
        .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
        .map((c, i) => ({ ...c, position: i })),
    }));
    setColumns(() => sorted);
    setGroupByUrgency(true);

    await Promise.all(
      sorted.map((col) =>
        fetchJSON(`/api/boards/${boardId}/columns/${col.id}/cards/reorder`, {
          method: "PATCH",
          body: { cardIds: col.cards.map((c) => c.id) },
        })
      )
    );
  }

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
    setGroupByUrgency(false);
  }

  return {
    availableTags,
    activePriorities,
    activeTagIds,
    groupByUrgency,
    hasFilters,
    filteredColumns,
    togglePriority,
    toggleTag,
    sortByUrgency,
    clearFilters,
  };
}
