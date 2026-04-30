"use client";

import type { Priority } from "@/lib/types";

const config: Record<Priority, { label: string; bar: string; badge: string }> = {
  HIGH: {
    label: "High",
    bar: "bg-terracotta",
    badge: "text-terracotta bg-terracotta-soft",
  },
  MEDIUM: {
    label: "Med",
    bar: "bg-gold",
    badge: "text-gold bg-gold-soft",
  },
  LOW: {
    label: "Low",
    bar: "bg-sage",
    badge: "text-sage bg-sage-soft",
  },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const p = config[priority];
  return (
    <span className={`shrink-0 text-[10px] font-body font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${p.badge}`}>
      {p.label}
    </span>
  );
}

export function PriorityBar({ priority }: { priority: Priority }) {
  const p = config[priority];
  return (
    <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-tile ${p.bar}`} />
  );
}
