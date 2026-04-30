"use client";

import { useState } from "react";
import { Modal } from "./Modal";

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
      const res = await fetch(`/api/boards/${boardId}/columns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
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
      <h2 className="font-display text-xl font-semibold text-parchment-800 mb-1">
        New Column
      </h2>
      <p className="text-xs text-parchment-500 font-body mb-6">
        Add a new stage to the board.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Under Review"
          autoFocus
          className="w-full bg-white border border-parchment-200 rounded-tile px-4 py-2.5 text-sm font-body text-parchment-800 placeholder:text-parchment-400 focus:outline-none focus:border-parchment-400 focus:ring-1 focus:ring-parchment-300 transition-colors"
        />

        <div className="flex justify-end gap-3 pt-2">
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
            {loading ? "Creating..." : "Create Column"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
