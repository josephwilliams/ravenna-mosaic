import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, handleError } from "@/lib/api";

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/comments/[commentId]">
) {
  try {
    const { commentId } = await ctx.params;
    await prisma.comment.delete({ where: { id: commentId } });
    return success({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
