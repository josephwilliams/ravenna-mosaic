"use client";

import { Filter, X } from "lucide-react";
import type { Priority, TagData } from "@/lib/types";

interface FilterBarProps {
  availableTags: TagData[];
  activePriorities: Priority[];
  activeTagIds: string[];
  onTogglePriority: (p: Priority) => void;
  onToggleTag: (id: string) => void;
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
  onTogglePriority,
  onToggleTag,
  onClear,
}: FilterBarProps) {
  const hasFilters = activePriorities.length > 0 || activeTagIds.length > 0;

  return (
    <div className="flex items-center gap-4 flex-wrap overflow-x-auto">
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
          <div className="flex items-center gap-1.5 flex-wrap">
            {availableTags.map((tag) => {
              const active = activeTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => onToggleTag(tag.id)}
                  className={`inline-flex items-center gap-1 text-[10px] font-body font-medium px-2.5 py-1 rounded-full transition-all duration-200 ${
                    active
                      ? "text-white"
                      : "text-parchment-500 bg-parchment-100 hover:bg-parchment-200"
                  }`}
                  style={active ? { backgroundColor: tag.color } : undefined}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: active ? "rgba(255,255,255,0.7)" : tag.color,
                    }}
                  />
                  {tag.name}
                </button>
              );
            })}
          </div>
        </>
      )}

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
