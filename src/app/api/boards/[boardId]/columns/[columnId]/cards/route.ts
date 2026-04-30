import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]/cards">
) {
  const { columnId } = await ctx.params;
  const cards = await prisma.card.findMany({
    where: { columnId, deletedAt: null },
    orderBy: { position: "asc" },
  });
  return NextResponse.json(cards);
}

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]/cards">
) {
  const { columnId } = await ctx.params;
  const { title, description, priority } = await req.json();

  const maxPos = await prisma.card.aggregate({
    where: { columnId },
    _max: { position: true },
  });

  const card = await prisma.card.create({
    data: {
      columnId,
      title,
      description,
      priority,
      position: (maxPos._max.position ?? -1) + 1,
    },
  });
  return NextResponse.json(card, { status: 201 });
}
