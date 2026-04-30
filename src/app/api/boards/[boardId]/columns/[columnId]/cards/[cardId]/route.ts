import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]/cards/[cardId]">
) {
  const { cardId } = await ctx.params;
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: { tags: { include: { tag: true } }, comments: true },
  });
  if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });
  return NextResponse.json(card);
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]/cards/[cardId]">
) {
  const { cardId } = await ctx.params;
  const data = await req.json();
  const card = await prisma.card.update({
    where: { id: cardId },
    data,
  });
  return NextResponse.json(card);
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]/cards/[cardId]">
) {
  const { cardId } = await ctx.params;
  const card = await prisma.card.update({
    where: { id: cardId },
    data: { deletedAt: new Date() },
  });
  return NextResponse.json(card);
}
