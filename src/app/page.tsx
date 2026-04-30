import { prisma } from "@/lib/prisma";
import { cardInclude } from "@/lib/queries";
import { Board } from "@/components/Board";

export default async function Home() {
  const board = await prisma.board.findFirst({
    include: {
      columns: {
        orderBy: { position: "asc" },
        include: {
          cards: {
            where: { deletedAt: null },
            orderBy: { position: "asc" },
            take: 5,
            include: cardInclude,
          },
          _count: { select: { cards: { where: { deletedAt: null } } } },
        },
      },
    },
  });

  if (!board) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="font-display text-stone-500 text-sm uppercase tracking-widest">
          No board found
        </p>
      </div>
    );
  }

  const columns = board.columns.map((col) => ({
    ...col,
    totalCards: col._count.cards,
  }));

  return <Board id={board.id} title={board.title} columns={columns} />;
}
