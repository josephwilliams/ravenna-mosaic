"use client";

import type { CardData } from "@/lib/types";
import { Tile } from "./Surface";
import { PriorityBadge, PriorityBar } from "./PriorityBadge";
import { TagChip } from "./TagChip";

interface CardProps extends CardData {
  index: number;
}

export function Card({ title, description, priority, tags, index }: CardProps) {
  return (
    <Tile
      className="px-4 py-3 cursor-default animate-tile-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <PriorityBar priority={priority} />

      <div className="flex items-start justify-between gap-3">
        <h3 className="font-body text-sm font-medium text-parchment-800 leading-snug">
          {title}
        </h3>
        <PriorityBadge priority={priority} />
      </div>

      {description && (
        <p className="mt-1.5 text-xs text-parchment-500 leading-relaxed line-clamp-2">
          {description}
        </p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.map(({ tag }) => (
            <TagChip key={tag.id} name={tag.name} color={tag.color} />
          ))}
        </div>
      )}
    </Tile>
  );
}
