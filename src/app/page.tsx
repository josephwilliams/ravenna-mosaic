import { prisma } from "@/lib/prisma";
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
          },
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

  return <Board id={board.id} title={board.title} columns={board.columns} />;
}
