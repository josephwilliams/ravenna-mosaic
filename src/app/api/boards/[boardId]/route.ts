import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]">
) {
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
  if (!board) return NextResponse.json({ error: "Board not found" }, { status: 404 });
  return NextResponse.json(board);
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]">
) {
  const { boardId } = await ctx.params;
  const { title } = await req.json();
  const board = await prisma.board.update({
    where: { id: boardId },
    data: { title },
  });
  return NextResponse.json(board);
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]">
) {
  const { boardId } = await ctx.params;
  await prisma.board.delete({ where: { id: boardId } });
  return NextResponse.json({ deleted: true });
}
