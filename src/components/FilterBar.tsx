"use client";

import { useState, useRef, useEffect } from "react";
import { Filter, ArrowDownUp, X } from "lucide-react";
import type { Priority, TagData } from "@/lib/types";

const VISIBLE_TAG_COUNT = 5;

interface FilterBarProps {
  availableTags: (TagData & { cardCount: number })[];
  activePriorities: Priority[];
  activeTagIds: string[];
  groupByUrgency: boolean;
  onTogglePriority: (p: Priority) => void;
  onToggleTag: (id: string) => void;
  onToggleGroupByUrgency: () => void;
  onClear: () => void;
}

const priorities: { value: Priority; label: string; activeClass: string }[] = [
  { value: "HIGH", label: "High", activeClass: "bg-terracotta text-white" },
  { value: "MEDIUM", label: "Med", activeClass: "bg-gold text-white" },
  { value: "LOW", label: "Low", activeClass: "bg-sage text-white" },
];

export function FilterBar({
  availableTags,
  activePriorities,
  activeTagIds,
  groupByUrgency,
  onTogglePriority,
  onToggleTag,
  onToggleGroupByUrgency,
  onClear,
}: FilterBarProps) {
  const hasFilters = activePriorities.length > 0 || activeTagIds.length > 0 || groupByUrgency;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-1.5 text-parchment-400">
        <Filter size={12} strokeWidth={1.5} />
        <span className="text-[10px] font-body font-semibold uppercase tracking-[0.12em]">
          Filter
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {priorities.map((p) => {
          const active = activePriorities.includes(p.value);
          return (
            <button
              key={p.value}
              onClick={() => onTogglePriority(p.value)}
              className={`text-[10px] font-body font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all duration-200 ${
                active
                  ? p.activeClass
                  : "text-parchment-500 bg-parchment-100 hover:bg-parchment-200"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {availableTags.length > 0 && (
        <>
          <div className="w-px h-4 bg-parchment-200" />
          <TagFilters
            tags={availableTags}
            activeTagIds={activeTagIds}
            onToggleTag={onToggleTag}
          />
        </>
      )}

      <div className="w-px h-4 bg-parchment-200" />

      <button
        onClick={onToggleGroupByUrgency}
        className={`flex items-center gap-1 text-[10px] font-body font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all duration-200 ${
          groupByUrgency
            ? "bg-parchment-800 text-white"
            : "text-parchment-500 bg-parchment-100 hover:bg-parchment-200"
        }`}
      >
        <ArrowDownUp size={10} strokeWidth={2} />
        Urgency
      </button>

      {hasFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-[10px] font-body font-medium text-parchment-400 hover:text-terracotta transition-colors ml-auto"
        >
          <X size={11} strokeWidth={2} />
          Clear
        </button>
      )}
    </div>
  );
}

function TagButton({ tag, active, onClick }: { tag: TagData; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-[10px] font-body font-medium px-2.5 py-1 rounded-full transition-all duration-200 ${
        active
          ? "text-white"
          : "text-parchment-500 bg-parchment-100 hover:bg-parchment-200"
      }`}
      style={active ? { backgroundColor: tag.color } : undefined}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: active ? "rgba(255,255,255,0.7)" : tag.color }}
      />
      {tag.name}
    </button>
  );
}

function TagFilters({ tags, activeTagIds, onToggleTag }: { tags: (TagData & { cardCount: number })[]; activeTagIds: string[]; onToggleTag: (id: string) => void }) {
  const [showOverflow, setShowOverflow] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const visible = tags.slice(0, VISIBLE_TAG_COUNT);
  const overflow = tags.slice(VISIBLE_TAG_COUNT);

  useEffect(() => {
    if (!showOverflow) return;
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowOverflow(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showOverflow]);

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {visible.map((tag) => (
        <TagButton key={tag.id} tag={tag} active={activeTagIds.includes(tag.id)} onClick={() => onToggleTag(tag.id)} />
      ))}

      {overflow.length > 0 && (
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setShowOverflow((v) => !v)}
            className="text-[10px] font-body font-semibold text-parchment-400 bg-parchment-100 hover:bg-parchment-200 px-2 py-1 rounded-full transition-colors"
          >
            +{overflow.length}
          </button>

          {showOverflow && (
            <div className="absolute top-full left-0 mt-1.5 z-50 bg-parchment-50 border border-parchment-200 rounded-tile shadow-tile-hover p-2 flex flex-col gap-1 min-w-[140px]">
              {overflow.map((tag) => (
                <TagButton key={tag.id} tag={tag} active={activeTagIds.includes(tag.id)} onClick={() => onToggleTag(tag.id)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
