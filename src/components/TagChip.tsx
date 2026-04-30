"use client";

interface TagChipProps {
  name: string;
  color: string;
}

export function TagChip({ name, color }: TagChipProps) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-body font-medium text-parchment-600 px-2 py-0.5 rounded-full border border-parchment-200"
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      {name}
    </span>
  );
}
