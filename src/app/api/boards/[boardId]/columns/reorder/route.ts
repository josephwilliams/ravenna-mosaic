import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;
  const { columnId, position } = await req.json();

  await prisma.$transaction(async (tx) => {
    const column = await tx.column.findUniqueOrThrow({ where: { id: columnId } });

    if (position > column.position) {
      await tx.column.updateMany({
        where: { boardId, position: { gt: column.position, lte: position } },
        data: { position: { decrement: 1 } },
      });
    } else if (position < column.position) {
      await tx.column.updateMany({
        where: { boardId, position: { gte: position, lt: column.position } },
        data: { position: { increment: 1 } },
      });
    }

    await tx.column.update({
      where: { id: columnId },
      data: { position },
    });
  });

  return NextResponse.json({ moved: true });
}
