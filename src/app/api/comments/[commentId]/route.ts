import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/comments/[commentId]">
) {
  const { commentId } = await ctx.params;
  await prisma.comment.delete({ where: { id: commentId } });
  return NextResponse.json({ deleted: true });
}
