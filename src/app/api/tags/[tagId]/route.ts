import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, error, handleError, ErrorCode } from "@/lib/api";

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/tags/[tagId]">
) {
  try {
    const { tagId } = await ctx.params;

    const usageCount = await prisma.cardTag.count({ where: { tagId } });
    if (usageCount > 0) {
      return error(ErrorCode.CONFLICT, "Cannot delete a tag that is in use");
    }

    await prisma.tag.delete({ where: { id: tagId } });
    return success({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
