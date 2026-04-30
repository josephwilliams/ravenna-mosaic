import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, error, validate, handleError, ErrorCode } from "@/lib/api";

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]">
) {
  try {
    const { columnId } = await ctx.params;
    const body = await req.json();
    const invalid = validate(body, { title: "string" });
    if (invalid) return error(ErrorCode.VALIDATION, invalid);

    const column = await prisma.column.update({
      where: { id: columnId },
      data: { title: body.title.trim() },
    });
    return success(column);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]">
) {
  try {
    const { columnId } = await ctx.params;

    const cardCount = await prisma.card.count({
      where: { columnId, deletedAt: null },
    });
    if (cardCount > 0) {
      return error(ErrorCode.CONFLICT, "Cannot delete a column that contains cards");
    }

    await prisma.column.delete({ where: { id: columnId } });
    return success({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
