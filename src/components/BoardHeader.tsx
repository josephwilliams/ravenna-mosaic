"use client";

import Link from "next/link";
import { Flame, Plus, Columns3, BookOpen, Archive, Tag } from "lucide-react";
import type { Priority, TagData } from "@/lib/types";
import { navItemClass } from "@/lib/styles";
import { FilterBar } from "./FilterBar";
import { MobileNav } from "./MobileNav";

interface BoardHeaderProps {
  title: string;
  availableTags: (TagData & { cardCount: number })[];
  activePriorities: Priority[];
  activeTagIds: string[];
  groupByUrgency: boolean;
  onNewCard: () => void;
  onNewColumn: () => void;
  onTags: () => void;
  onTogglePriority: (p: Priority) => void;
  onToggleTag: (id: string) => void;
  onToggleGroupByUrgency: () => void;
  onClearFilters: () => void;
}

export function BoardHeader({
  title,
  availableTags,
  activePriorities,
  activeTagIds,
  groupByUrgency,
  onNewCard,
  onNewColumn,
  onTags,
  onTogglePriority,
  onToggleTag,
  onToggleGroupByUrgency,
  onClearFilters,
}: BoardHeaderProps) {
  return (
    <header className="shrink-0 px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 animate-fade-in">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-parchment-700" strokeWidth={1.5} />
          <h1 className="font-display text-xl font-semibold text-parchment-800">
            {title}
          </h1>
        </div>

        <button onClick={onNewCard} className={navItemClass}>
          <Plus size={13} strokeWidth={2} />
          New Card
        </button>

        <button onClick={onNewColumn} className={navItemClass}>
          <Columns3 size={13} strokeWidth={1.5} />
          New Column
        </button>

        <button onClick={onTags} className={navItemClass}>
          <Tag size={13} strokeWidth={1.5} />
          Tags
        </button>

        <Link href="/archive" className={navItemClass}>
          <Archive size={13} strokeWidth={1.5} />
          Archive
        </Link>

        <Link href="/ponderings" className={navItemClass}>
          <BookOpen size={13} strokeWidth={1.5} />
          Ponderings
        </Link>

        <div className="h-px flex-1 bg-gradient-to-r from-parchment-300 to-transparent" />

        <MobileNav
          onNewCard={onNewCard}
          onNewColumn={onNewColumn}
          onTags={onTags}
        />
      </div>

      {availableTags.length > 0 && (
        <div className="mt-4">
          <FilterBar
            availableTags={availableTags}
            activePriorities={activePriorities}
            activeTagIds={activeTagIds}
            groupByUrgency={groupByUrgency}
            onTogglePriority={onTogglePriority}
            onToggleTag={onToggleTag}
            onToggleGroupByUrgency={onToggleGroupByUrgency}
            onClear={onClearFilters}
          />
        </div>
      )}
    </header>
  );
}
