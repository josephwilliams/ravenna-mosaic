import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, error, validate, handleError, ErrorCode } from "@/lib/api";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]">
) {
  try {
    const { boardId } = await ctx.params;
    const { searchParams } = req.nextUrl;

    const priority = searchParams.getAll("priority");
    const tagIds = searchParams.getAll("tagId");

    const cardWhere: Record<string, unknown> = { deletedAt: null };
    if (priority.length > 0) cardWhere.priority = { in: priority };
    if (tagIds.length > 0) cardWhere.tags = { some: { tagId: { in: tagIds } } };

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          orderBy: { position: "asc" },
          include: {
            cards: {
              where: cardWhere,
              orderBy: { position: "asc" },
              include: { tags: { include: { tag: true } }, _count: { select: { comments: true } } },
            },
          },
        },
      },
    });
    if (!board) return error(ErrorCode.NOT_FOUND, "Board not found");
    return success(board);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]">
) {
  try {
    const { boardId } = await ctx.params;
    const body = await req.json();
    const invalid = validate(body, { title: "string" });
    if (invalid) return error(ErrorCode.VALIDATION, invalid);

    const board = await prisma.board.update({
      where: { id: boardId },
      data: { title: body.title.trim() },
    });
    return success(board);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]">
) {
  try {
    const { boardId } = await ctx.params;
    await prisma.board.delete({ where: { id: boardId } });
    return success({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
