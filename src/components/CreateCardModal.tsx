"use client";

import { useState } from "react";
import type { Priority, ColumnData } from "@/lib/types";
import { Modal } from "./Modal";
import { TagPicker } from "./TagPicker";

interface CreateCardModalProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
  columns: ColumnData[];
}

const priorities: { value: Priority; label: string }[] = [
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

export function CreateCardModal({ open, onClose, boardId, columns }: CreateCardModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState(columns[0]?.id ?? "");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/boards/${boardId}/columns/${columnId}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim() || undefined, priority }),
      });
      if (res.ok) {
        const { data: card } = await res.json();
        if (tagIds.length > 0) {
          await fetch(`/api/cards/${card.id}/tags`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tagIds }),
          });
        }
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setTagIds([]);
        onClose();
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full bg-white border border-parchment-200 rounded-tile px-4 py-2.5 text-sm font-body text-parchment-800 placeholder:text-parchment-400 focus:outline-none focus:border-parchment-400 focus:ring-1 focus:ring-parchment-300 transition-colors";

  const selectClass =
    "bg-white border border-parchment-200 rounded-tile px-3 py-2 text-sm font-body text-parchment-700 focus:outline-none focus:border-parchment-400 focus:ring-1 focus:ring-parchment-300 transition-colors";

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="font-display text-xl font-semibold text-parchment-800 mb-1">
        New Card
      </h2>
      <p className="text-xs text-parchment-500 font-body mb-6">
        Submit a petition to the council.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Investigate the rumors from Harrenhal"
          autoFocus
          className={inputClass}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Further details for the council (optional)"
          rows={3}
          className={`${inputClass} resize-none`}
        />

        <div className="flex gap-3">
          <select
            value={columnId}
            onChange={(e) => setColumnId(e.target.value)}
            className={`flex-1 ${selectClass}`}
          >
            {columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className={selectClass}
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <TagPicker selected={tagIds} onChange={setTagIds} />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-body font-medium text-parchment-500 hover:text-parchment-700 transition-colors"
          >
            Dismiss
          </button>
          <button
            type="submit"
            disabled={!title.trim() || loading}
            className="px-5 py-2 text-xs font-body font-semibold text-parchment-50 bg-parchment-800 rounded-tile hover:bg-parchment-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Submitting..." : "Submit Petition"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
