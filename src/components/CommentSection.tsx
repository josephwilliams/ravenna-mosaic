"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { CommentData } from "@/lib/types";
import { Tile } from "./Surface";

interface CommentSectionProps {
  cardId: string;
  initialComments: CommentData[];
}

export function CommentSection({ cardId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cards/${cardId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [...prev, comment]);
        setContent("");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(commentId: string) {
    const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const inputClass =
    "w-full bg-white border border-parchment-200 rounded-tile px-4 py-2.5 text-sm font-body text-parchment-800 placeholder:text-parchment-400 focus:outline-none focus:border-parchment-400 focus:ring-1 focus:ring-parchment-300 transition-colors";

  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-parchment-800 mb-4">
        Comments
        {comments.length > 0 && (
          <span className="ml-2 text-sm font-body font-medium text-parchment-400">
            {comments.length}
          </span>
        )}
      </h2>

      {comments.length > 0 ? (
        <div className="space-y-3 mb-8">
          {comments.map((comment, i) => (
            <Tile
              key={comment.id}
              className="px-4 py-3 animate-tile-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-body text-parchment-400">
                    {formatDate(comment.createdAt)}
                  </span>
                  <p className="mt-1 text-sm font-body text-parchment-600 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="shrink-0 p-1 text-parchment-300 hover:text-terracotta transition-colors"
                >
                  <Trash2 size={12} strokeWidth={1.5} />
                </button>
              </div>
            </Tile>
          ))}
        </div>
      ) : (
        <p className="text-sm text-parchment-400 font-body italic mb-8">
          No remarks yet.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Add a remark..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!content.trim() || loading}
            className="px-5 py-2 text-xs font-body font-semibold text-parchment-50 bg-parchment-800 rounded-tile hover:bg-parchment-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Posting..." : "Post Remark"}
          </button>
        </div>
      </form>
    </section>
  );
}
