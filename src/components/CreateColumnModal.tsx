"use client";

import { useState } from "react";
import { inputClass } from "@/lib/styles";
import { fetchJSON } from "@/lib/fetch";
import { Modal, ModalHeader, ModalActions } from "./Modal";

interface CreateColumnModalProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
  onCreated: () => void;
}

export function CreateColumnModal({ open, onClose, boardId, onCreated }: CreateColumnModalProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetchJSON(`/api/boards/${boardId}/columns`, {
        method: "POST",
        body: { title: title.trim() },
      });
      if (res.ok) {
        setTitle("");
        onClose();
        onCreated();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader title="New Column" description="Add a new stage to the board." />

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Under Review"
          autoFocus
          className={inputClass}
        />

        <ModalActions
          submitLabel="Create Column"
          loadingLabel="Creating..."
          disabled={!title.trim()}
          loading={loading}
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
}
