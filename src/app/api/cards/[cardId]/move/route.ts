import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/cards/[cardId]/move">
) {
  const { cardId } = await ctx.params;
  const { columnId, position } = await req.json();

  await prisma.$transaction(async (tx) => {
    const card = await tx.card.findUniqueOrThrow({ where: { id: cardId } });
    const movingBetweenColumns = card.columnId !== columnId;

    if (movingBetweenColumns) {
      // Close the gap in the source column
      await tx.card.updateMany({
        where: { columnId: card.columnId, position: { gt: card.position }, deletedAt: null },
        data: { position: { decrement: 1 } },
      });

      // Make room in the destination column
      await tx.card.updateMany({
        where: { columnId, position: { gte: position }, deletedAt: null },
        data: { position: { increment: 1 } },
      });
    } else {
      // Reorder within the same column
      if (position > card.position) {
        await tx.card.updateMany({
          where: { columnId, position: { gt: card.position, lte: position }, deletedAt: null },
          data: { position: { decrement: 1 } },
        });
      } else if (position < card.position) {
        await tx.card.updateMany({
          where: { columnId, position: { gte: position, lt: card.position }, deletedAt: null },
          data: { position: { increment: 1 } },
        });
      }
    }

    await tx.card.update({
      where: { id: cardId },
      data: { columnId, position },
    });
  });

  return NextResponse.json({ moved: true });
}
