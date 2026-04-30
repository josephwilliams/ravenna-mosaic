"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { Priority, CardData } from "@/lib/types";
import { Modal } from "./Modal";

interface EditCardModalProps {
  open: boolean;
  onClose: () => void;
  card: CardData;
  boardId: string;
  columnId: string;
}

const priorities: { value: Priority; label: string }[] = [
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

export function EditCardModal({ open, onClose, card, boardId, columnId }: EditCardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");
  const [priority, setPriority] = useState<Priority>(card.priority);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const endpoint = `/api/boards/${boardId}/columns/${columnId}/cards/${card.id}`;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          priority,
        }),
      });
      if (res.ok) {
        onClose();
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        onClose();
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full bg-white border border-parchment-200 rounded-tile px-4 py-2.5 text-sm font-body text-parchment-800 placeholder:text-parchment-400 focus:outline-none focus:border-parchment-400 focus:ring-1 focus:ring-parchment-300 transition-colors";

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="font-display text-xl font-semibold text-parchment-800 mb-6">
        Edit Card
      </h2>

      <form onSubmit={handleSave} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className={inputClass}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={3}
          className={`${inputClass} resize-none`}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="bg-white border border-parchment-200 rounded-tile px-3 py-2 text-sm font-body text-parchment-700 focus:outline-none focus:border-parchment-400 focus:ring-1 focus:ring-parchment-300 transition-colors"
        >
          {priorities.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <div className="flex items-center justify-between pt-2">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-xs font-body font-medium text-parchment-400 hover:text-terracotta transition-colors"
            >
              <Trash2 size={13} strokeWidth={1.5} />
              Archive
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-body font-semibold text-terracotta"
            >
              <Trash2 size={13} strokeWidth={1.5} />
              Confirm archive?
            </button>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-body font-medium text-parchment-500 hover:text-parchment-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className="px-5 py-2 text-xs font-body font-semibold text-parchment-50 bg-parchment-800 rounded-tile hover:bg-parchment-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
