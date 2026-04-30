import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string; columnId: string }> }
) {
  const { columnId } = await params;
  const { cardIds } = await req.json() as { cardIds: string[] };

  await prisma.$transaction(
    cardIds.map((id, position) =>
      prisma.card.update({ where: { id }, data: { position } })
    )
  );

  return NextResponse.json({ reordered: true });
}
