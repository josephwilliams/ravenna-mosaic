import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, error, validate, validatePriority, handleError, ErrorCode } from "@/lib/api";

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

    const priorityErr = validatePriority(body.priority);
    if (priorityErr) return error(ErrorCode.VALIDATION, priorityErr);

    if (body.title !== undefined) {
      const invalid = validate({ title: body.title }, { title: "string" });
      if (invalid) return error(ErrorCode.VALIDATION, invalid);
    }

    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.description !== undefined && { description: body.description?.trim() || null }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.deletedAt !== undefined && { deletedAt: body.deletedAt }),
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
