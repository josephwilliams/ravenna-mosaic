import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { backLinkClass } from "@/lib/styles";
import { ArchiveList } from "@/components/ArchiveList";

export default async function ArchivePage() {
  const cards = await prisma.card.findMany({
    where: { deletedAt: { not: null } },
    include: {
      column: true,
      tags: { include: { tag: true } },
    },
    orderBy: { deletedAt: "desc" },
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-8 py-16">
        <header className="mb-12 animate-fade-in">
          <Link href="/" className={backLinkClass}>
            <ArrowLeft size={13} strokeWidth={1.5} />
            Back to the board
          </Link>

          <h1 className="font-display text-3xl font-semibold text-parchment-800 mt-6">
            Archive
          </h1>
          <p className="font-body text-sm text-parchment-500 mt-2 leading-relaxed">
            Cards laid to rest. They can be restored to the board at any time.
          </p>
          <div className="h-px mt-6 bg-gradient-to-r from-parchment-300 to-transparent" />
        </header>

        <ArchiveList cards={cards} />
      </div>
    </div>
  );
}
