import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, error, handleError, ErrorCode } from "@/lib/api";
import { tagIdsSchema, parseBody } from "@/lib/schemas";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/cards/[cardId]/tags">
) {
  try {
    const { cardId } = await ctx.params;
    const body = await req.json();
    const parsed = parseBody(tagIdsSchema, body);
    if ("error" in parsed) return error(ErrorCode.VALIDATION, parsed.error);

    await prisma.$transaction([
      prisma.cardTag.deleteMany({ where: { cardId } }),
      prisma.cardTag.createMany({
        data: parsed.data.tagIds.map((tagId) => ({ cardId, tagId })),
      }),
    ]);

    return success({ updated: true });
  } catch (err) {
    return handleError(err);
  }
}
