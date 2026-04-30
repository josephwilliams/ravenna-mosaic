import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]">
) {
  const { columnId } = await ctx.params;
  const data = await req.json();
  const column = await prisma.column.update({
    where: { id: columnId },
    data,
  });
  return NextResponse.json(column);
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]">
) {
  const { columnId } = await ctx.params;
  await prisma.column.delete({ where: { id: columnId } });
  return NextResponse.json({ deleted: true });
}
