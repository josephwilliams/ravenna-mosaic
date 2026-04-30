import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, error, validate, handleError, ErrorCode } from "@/lib/api";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/cards/[cardId]/tags">
) {
  try {
    const { cardId } = await ctx.params;
    const body = await req.json();
    const invalid = validate(body, { tagIds: "string[]" });
    if (invalid) return error(ErrorCode.VALIDATION, invalid);

    await prisma.$transaction([
      prisma.cardTag.deleteMany({ where: { cardId } }),
      prisma.cardTag.createMany({
        data: body.tagIds.map((tagId: string) => ({ cardId, tagId })),
      }),
    ]);

    return success({ updated: true });
  } catch (err) {
    return handleError(err);
  }
}
