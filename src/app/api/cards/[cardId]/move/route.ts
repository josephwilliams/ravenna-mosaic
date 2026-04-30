import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, error, validate, handleError, ErrorCode } from "@/lib/api";

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/cards/[cardId]/move">
) {
  try {
    const { cardId } = await ctx.params;
    const body = await req.json();
    const invalid = validate(body, { columnId: "string", position: "number" });
    if (invalid) return error(ErrorCode.VALIDATION, invalid);

    await prisma.$transaction(async (tx) => {
      const card = await tx.card.findUniqueOrThrow({ where: { id: cardId } });
      const movingBetweenColumns = card.columnId !== body.columnId;

      if (movingBetweenColumns) {
        await tx.card.updateMany({
          where: { columnId: card.columnId, position: { gt: card.position }, deletedAt: null },
          data: { position: { decrement: 1 } },
        });
        await tx.card.updateMany({
          where: { columnId: body.columnId, position: { gte: body.position }, deletedAt: null },
          data: { position: { increment: 1 } },
        });
      } else {
        if (body.position > card.position) {
          await tx.card.updateMany({
            where: { columnId: body.columnId, position: { gt: card.position, lte: body.position }, deletedAt: null },
            data: { position: { decrement: 1 } },
          });
        } else if (body.position < card.position) {
          await tx.card.updateMany({
            where: { columnId: body.columnId, position: { gte: body.position, lt: card.position }, deletedAt: null },
            data: { position: { increment: 1 } },
          });
        }
      }

      await tx.card.update({
        where: { id: cardId },
        data: { columnId: body.columnId, position: body.position },
      });
    });

    return success({ moved: true });
  } catch (err) {
    return handleError(err);
  }
}
