import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, error, handleError, ErrorCode } from "@/lib/api";
import { moveSchema, parseBody } from "@/lib/schemas";

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/cards/[cardId]/move">
) {
  try {
    const { cardId } = await ctx.params;
    const body = await req.json();
    const parsed = parseBody(moveSchema, body);
    if ("error" in parsed) return error(ErrorCode.VALIDATION, parsed.error);
    const { columnId: toColumnId, position } = parsed.data;

    await prisma.$transaction(async (tx) => {
      const card = await tx.card.findUniqueOrThrow({ where: { id: cardId } });
      const movingBetweenColumns = card.columnId !== toColumnId;

      if (movingBetweenColumns) {
        await tx.card.updateMany({
          where: { columnId: card.columnId, position: { gt: card.position }, deletedAt: null },
          data: { position: { decrement: 1 } },
        });
        await tx.card.updateMany({
          where: { columnId: toColumnId, position: { gte: position }, deletedAt: null },
          data: { position: { increment: 1 } },
        });
      } else {
        if (position > card.position) {
          await tx.card.updateMany({
            where: { columnId: toColumnId, position: { gt: card.position, lte: position }, deletedAt: null },
            data: { position: { decrement: 1 } },
          });
        } else if (position < card.position) {
          await tx.card.updateMany({
            where: { columnId: toColumnId, position: { gte: position, lt: card.position }, deletedAt: null },
            data: { position: { increment: 1 } },
          });
        }
      }

      await tx.card.update({
        where: { id: cardId },
        data: { columnId: toColumnId, position },
      });
    });

    return success({ moved: true });
  } catch (err) {
    return handleError(err);
  }
}
