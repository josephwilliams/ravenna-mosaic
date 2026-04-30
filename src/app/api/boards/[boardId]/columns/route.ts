import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns">
) {
  const { boardId } = await ctx.params;
  const columns = await prisma.column.findMany({
    where: { boardId },
    orderBy: { position: "asc" },
  });
  return NextResponse.json(columns);
}

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns">
) {
  const { boardId } = await ctx.params;
  const { title } = await req.json();

  const maxPos = await prisma.column.aggregate({
    where: { boardId },
    _max: { position: true },
  });

  const column = await prisma.column.create({
    data: {
      boardId,
      title,
      position: (maxPos._max.position ?? -1) + 1,
    },
  });
  return NextResponse.json(column, { status: 201 });
}
