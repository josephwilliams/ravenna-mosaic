import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, error, handleError, ErrorCode } from "@/lib/api";
import { reorderCardsSchema, parseBody } from "@/lib/schemas";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string; columnId: string }> }
) {
  try {
    await params;
    const body = await req.json();
    const parsed = parseBody(reorderCardsSchema, body);
    if ("error" in parsed) return error(ErrorCode.VALIDATION, parsed.error);

    const { cardIds, columnId: targetColumnId } = parsed.data;
    await prisma.$transaction(
      cardIds.map((id, position) =>
        prisma.card.update({
          where: { id },
          data: { position, ...(targetColumnId && { columnId: targetColumnId }) },
        })
      )
    );

    return success({ reordered: true });
  } catch (err) {
    return handleError(err);
  }
}
