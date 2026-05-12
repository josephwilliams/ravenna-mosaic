import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, error, handleError, ErrorCode } from "@/lib/api";
import { updateCardSchema, parseBody } from "@/lib/schemas";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]/cards/[cardId]">
) {
  try {
    const { cardId } = await ctx.params;
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: { tags: { include: { tag: true } }, comments: true },
    });
    if (!card) return error(ErrorCode.NOT_FOUND, "Card not found");
    return success(card);
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]/cards/[cardId]">
) {
  try {
    const { cardId } = await ctx.params;
    const body = await req.json();

    const parsed = parseBody(updateCardSchema, body);
    if ("error" in parsed) return error(ErrorCode.VALIDATION, parsed.error);

    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        ...(parsed.data.title !== undefined && { title: parsed.data.title }),
        ...(parsed.data.description !== undefined && { description: parsed.data.description?.trim() || null }),
        ...(parsed.data.priority !== undefined && { priority: parsed.data.priority }),
        ...(parsed.data.deletedAt !== undefined && { deletedAt: parsed.data.deletedAt }),
      },
    });
    return success(card);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]/cards/[cardId]">
) {
  try {
    const { cardId } = await ctx.params;
    const card = await prisma.card.update({
      where: { id: cardId },
      data: { deletedAt: new Date() },
    });
    return success(card);
  } catch (err) {
    return handleError(err);
  }
}
