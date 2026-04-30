"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { Priority, CardData } from "@/lib/types";
import { inputClass, selectClass, priorities, btnPrimary, btnSecondary } from "@/lib/styles";
import { fetchJSON } from "@/lib/fetch";
import { Modal, ModalHeader } from "./Modal";
import { TagPicker } from "./TagPicker";

interface EditCardModalProps {
  open: boolean;
  onClose: () => void;
  card: CardData;
  boardId: string;
  columnId: string;
}

export function EditCardModal({ open, onClose, card, boardId, columnId }: EditCardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");
  const [priority, setPriority] = useState<Priority>(card.priority);
  const [tagIds, setTagIds] = useState<string[]>(card.tags.map((t) => t.tag.id));
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const endpoint = `/api/boards/${boardId}/columns/${columnId}/cards/${card.id}`;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const [cardRes, tagsRes] = await Promise.all([
        fetchJSON(endpoint, {
          method: "PATCH",
          body: { title: title.trim(), description: description.trim() || null, priority },
        }),
        fetchJSON(`/api/cards/${card.id}/tags`, { method: "PUT", body: { tagIds } }),
      ]);
      if (cardRes.ok && tagsRes.ok) {
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
      const res = await fetchJSON(endpoint, { method: "DELETE" });
      if (res.ok) {
        onClose();
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader title="Edit Card" />

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
          className={selectClass}
        >
          {priorities.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <TagPicker selected={tagIds} onChange={setTagIds} />

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
            <button type="button" onClick={onClose} className={btnSecondary}>
              Cancel
            </button>
            <button type="submit" disabled={!title.trim() || loading} className={btnPrimary}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
