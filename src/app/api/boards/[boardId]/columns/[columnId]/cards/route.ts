import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, created, error, validate, validatePriority, handleError, ErrorCode } from "@/lib/api";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]/cards">
) {
  try {
    const { columnId } = await ctx.params;
    const { searchParams } = req.nextUrl;
    const skip = parseInt(searchParams.get("skip") ?? "0", 10) || 0;
    const take = parseInt(searchParams.get("take") ?? "50", 10) || 50;

    const cards = await prisma.card.findMany({
      where: { columnId, deletedAt: null },
      orderBy: { position: "asc" },
      skip,
      take,
      include: { tags: { include: { tag: true } }, _count: { select: { comments: true } } },
    });
    return success(cards);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]/cards">
) {
  try {
    const { columnId } = await ctx.params;
    const body = await req.json();

    const invalid = validate(body, { title: "string" });
    if (invalid) return error(ErrorCode.VALIDATION, invalid);

    const priorityErr = validatePriority(body.priority);
    if (priorityErr) return error(ErrorCode.VALIDATION, priorityErr);

    const maxPos = await prisma.card.aggregate({
      where: { columnId },
      _max: { position: true },
    });

    const card = await prisma.card.create({
      data: {
        columnId,
        title: body.title.trim(),
        description: body.description?.trim() || null,
        priority: body.priority ?? "MEDIUM",
        position: (maxPos._max.position ?? -1) + 1,
      },
    });
    return created(card);
  } catch (err) {
    return handleError(err);
  }
}
