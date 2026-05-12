import { prisma } from "@/lib/prisma";
import { cardInclude } from "@/lib/queries";
import { NextRequest } from "next/server";
import { success, error, validatePriority, handleError, ErrorCode } from "@/lib/api";
import { titleSchema, parseBody } from "@/lib/schemas";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]">
) {
  try {
    const { boardId } = await ctx.params;
    const { searchParams } = req.nextUrl;

    const priorities = searchParams.getAll("priority");
    const tagIds = searchParams.getAll("tagId");

    for (const p of priorities) {
      const err = validatePriority(p);
      if (err) return error(ErrorCode.VALIDATION, err);
    }

    const cardWhere: Record<string, unknown> = { deletedAt: null };
    if (priorities.length > 0) cardWhere.priority = { in: priorities };
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
              take: 5,
              include: cardInclude,
            },
            _count: { select: { cards: { where: { deletedAt: null } } } },
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
    const parsed = parseBody(titleSchema, body);
    if ("error" in parsed) return error(ErrorCode.VALIDATION, parsed.error);

    const board = await prisma.board.update({
      where: { id: boardId },
      data: { title: parsed.data.title },
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
