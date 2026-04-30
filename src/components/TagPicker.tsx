"use client";

import { useState, useEffect } from "react";
import type { TagData } from "@/lib/types";

interface TagPickerProps {
  selected: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagPicker({ selected, onChange }: TagPickerProps) {
  const [tags, setTags] = useState<TagData[]>([]);

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then((data) => setTags(data.map((t: TagData & { _count?: unknown }) => ({ id: t.id, name: t.name, color: t.color }))));
  }, []);

  function toggle(tagId: string) {
    if (selected.includes(tagId)) {
      onChange(selected.filter((id) => id !== tagId));
    } else {
      onChange([...selected, tagId]);
    }
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const active = selected.includes(tag.id);
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.id)}
            className={`inline-flex items-center gap-1.5 text-[11px] font-body font-medium px-2.5 py-1 rounded-full border transition-all ${
              active
                ? "border-parchment-400 bg-parchment-200 text-parchment-800"
                : "border-parchment-200 bg-white text-parchment-500 hover:border-parchment-300"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: tag.color }}
            />
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}
