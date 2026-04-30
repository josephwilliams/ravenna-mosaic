import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PriorityBadge } from "@/components/PriorityBadge";
import { TagChip } from "@/components/TagChip";
import { CommentSection } from "@/components/CommentSection";

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;

  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      column: { include: { board: true } },
      tags: { include: { tag: true } },
      comments: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!card || card.deletedAt) return notFound();

  return (
    <div className="min-h-full">
      <div className="max-w-2xl mx-auto px-8 py-16">
        <header className="mb-10 animate-fade-in">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-body font-medium text-parchment-400 hover:text-terracotta transition-colors"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            Back to {card.column.board.title}
          </Link>

          <div className="mt-6 flex items-center gap-2 text-[10px] font-body font-semibold uppercase tracking-[0.12em] text-parchment-400">
            <span>{card.column.title}</span>
          </div>

          <h1 className="font-display text-2xl font-semibold text-parchment-800 mt-2">
            {card.title}
          </h1>

          <div className="flex items-center gap-3 mt-3">
            <PriorityBadge priority={card.priority} />
            {card.tags.map(({ tag }) => (
              <TagChip key={tag.id} name={tag.name} color={tag.color} />
            ))}
          </div>

          {card.description && (
            <p className="mt-4 font-body text-sm text-parchment-600 leading-relaxed">
              {card.description}
            </p>
          )}

          <div className="h-px mt-8 bg-gradient-to-r from-parchment-300 to-transparent" />
        </header>

        <CommentSection
          cardId={card.id}
          initialComments={card.comments.map((c) => ({
            id: c.id,
            author: c.author,
            content: c.content,
            createdAt: c.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
