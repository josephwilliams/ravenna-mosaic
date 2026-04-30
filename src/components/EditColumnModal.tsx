"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { inputClass, btnPrimary, btnSecondary } from "@/lib/styles";
import { fetchJSON } from "@/lib/fetch";
import { Modal, ModalHeader } from "./Modal";

interface EditColumnModalProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
  column: { id: string; title: string; cardCount: number };
  onUpdated: () => void;
}

export function EditColumnModal({ open, onClose, boardId, column, onUpdated }: EditColumnModalProps) {
  const [title, setTitle] = useState(column.title);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const endpoint = `/api/boards/${boardId}/columns/${column.id}`;
  const hasCards = column.cardCount > 0;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetchJSON(endpoint, { method: "PATCH", body: { title: title.trim() } });
      if (res.ok) {
        onClose();
        onUpdated();
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
        onUpdated();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader title="Edit Column" />

      <form onSubmit={handleSave} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className={inputClass}
        />

        <div className="flex items-center justify-between pt-2">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => !hasCards && setConfirmDelete(true)}
              disabled={hasCards}
              className={`flex items-center gap-1.5 text-xs font-body font-medium transition-colors ${
                hasCards
                  ? "text-parchment-300 cursor-not-allowed"
                  : "text-parchment-400 hover:text-terracotta"
              }`}
              title={hasCards ? "Move or archive all cards first" : undefined}
            >
              <Trash2 size={13} strokeWidth={1.5} />
              Delete
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-body font-semibold text-terracotta"
            >
              <Trash2 size={13} strokeWidth={1.5} />
              Confirm delete?
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
