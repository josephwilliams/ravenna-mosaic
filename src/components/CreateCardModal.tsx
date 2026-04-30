"use client";

import { useState } from "react";
import type { Priority, ColumnData } from "@/lib/types";
import { inputClass, selectClass, priorities } from "@/lib/styles";
import { fetchJSON } from "@/lib/fetch";
import { Modal, ModalHeader, ModalActions } from "./Modal";
import { TagPicker } from "./TagPicker";

interface CreateCardModalProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
  columns: ColumnData[];
  defaultColumnId?: string;
}

export function CreateCardModal({ open, onClose, boardId, columns, defaultColumnId }: CreateCardModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState(columns[0]?.id ?? "");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const effectiveColumnId = defaultColumnId ?? columnId;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetchJSON<{ id: string }>(`/api/boards/${boardId}/columns/${effectiveColumnId}/cards`, {
        method: "POST",
        body: { title: title.trim(), description: description.trim() || undefined, priority },
      });
      if (res.ok) {
        if (tagIds.length > 0) {
          await fetchJSON(`/api/cards/${res.data.id}/tags`, { method: "PUT", body: { tagIds } });
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

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader title="New Card" description="Submit a petition to the council." />

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
            value={effectiveColumnId}
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

        <ModalActions
          cancelLabel="Dismiss"
          submitLabel="Submit Petition"
          loadingLabel="Submitting..."
          disabled={!title.trim()}
          loading={loading}
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
}
