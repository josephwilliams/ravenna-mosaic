import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]">
) {
  const { boardId } = await ctx.params;
  const board = await prisma.board.findUnique({
    where: { id: boardId },
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
