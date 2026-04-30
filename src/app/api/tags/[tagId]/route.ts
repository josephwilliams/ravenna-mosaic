import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/tags/[tagId]">
) {
  const { tagId } = await ctx.params;

  const usageCount = await prisma.cardTag.count({ where: { tagId } });
  if (usageCount > 0) {
    return NextResponse.json(
      { error: "Cannot delete a tag that is in use" },
      { status: 409 }
    );
  }

  await prisma.tag.delete({ where: { id: tagId } });
  return NextResponse.json({ deleted: true });
}
