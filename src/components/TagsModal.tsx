"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { inputClass, btnPrimary, btnSecondary } from "@/lib/styles";
import { fetchJSON } from "@/lib/fetch";
import { Modal, ModalHeader } from "./Modal";

interface TagWithCount {
  id: string;
  name: string;
  color: string;
  _count: { cards: number };
}

const PRESET_COLORS = [
  "#b85c38", "#b8963e", "#5e8a65", "#4a7c9b",
  "#8a7560", "#9b5a7c", "#5a6e9b", "#7c5a3e",
];

interface TagsModalProps {
  open: boolean;
  onClose: () => void;
}

export function TagsModal({ open, onClose }: TagsModalProps) {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchJSON<TagWithCount[]>("/api/tags").then(({ data }) => setTags(data));
    }
  }, [open]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchJSON<TagWithCount>("/api/tags", {
        method: "POST",
        body: { name: name.trim(), color },
      });
      if (res.ok) {
        setTags((prev) => [...prev, { ...res.data, _count: { cards: 0 } }].sort((a, b) => a.name.localeCompare(b.name)));
        setName("");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(tag: TagWithCount) {
    setError(null);
    const res = await fetchJSON(`/api/tags/${tag.id}`, { method: "DELETE" });
    if (res.ok) {
      setTags((prev) => prev.filter((t) => t.id !== tag.id));
    } else {
      setError(res.errorMessage ?? "Failed to delete tag");
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader title="Tags" description="Manage the sigils of the realm." />

      {error && (
        <div className="text-xs font-body text-terracotta bg-terracotta-soft rounded-tile px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center justify-between px-3 py-2 bg-white border border-parchment-200 rounded-tile">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
              <span className="text-sm font-body font-medium text-parchment-700">{tag.name}</span>
              <span className="text-[10px] font-body text-parchment-400">
                {tag._count.cards} {tag._count.cards === 1 ? "card" : "cards"}
              </span>
            </div>
            <button
              onClick={() => handleDelete(tag)}
              disabled={tag._count.cards > 0}
              className={`p-1 transition-colors ${
                tag._count.cards > 0
                  ? "text-parchment-200 cursor-not-allowed"
                  : "text-parchment-400 hover:text-terracotta"
              }`}
              title={tag._count.cards > 0 ? "Cannot delete — tag is in use" : "Delete tag"}
            >
              <Trash2 size={13} strokeWidth={1.5} />
            </button>
          </div>
        ))}

        {tags.length === 0 && (
          <p className="text-sm text-parchment-400 font-body italic text-center py-4">
            No tags yet.
          </p>
        )}
      </div>

      <form onSubmit={handleCreate} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New tag name"
          className={inputClass}
        />

        <div className="flex items-center gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full transition-all ${
                color === c ? "ring-2 ring-parchment-400 ring-offset-2 ring-offset-parchment-50 scale-110" : "hover:scale-110"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={btnSecondary}>
            Done
          </button>
          <button type="submit" disabled={!name.trim() || loading} className={btnPrimary}>
            {loading ? "Creating..." : "Add Tag"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
