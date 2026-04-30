import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/cards/[cardId]/tags">
) {
  const { cardId } = await ctx.params;
  const { tagIds } = await req.json();

  await prisma.$transaction([
    prisma.cardTag.deleteMany({ where: { cardId } }),
    prisma.cardTag.createMany({
      data: tagIds.map((tagId: string) => ({ cardId, tagId })),
    }),
  ]);

  return NextResponse.json({ updated: true });
}
