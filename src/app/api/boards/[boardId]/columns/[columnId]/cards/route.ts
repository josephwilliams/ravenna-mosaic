import { prisma } from "@/lib/prisma";
import { cardInclude } from "@/lib/queries";
import { NextRequest } from "next/server";
import { success, created, error, validate, validateLength, validatePriority, handleError, ErrorCode } from "@/lib/api";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns/[columnId]/cards">
) {
  try {
    const { columnId } = await ctx.params;
    const { searchParams } = req.nextUrl;
    const skip = parseInt(searchParams.get("skip") ?? "0", 10);
    const take = parseInt(searchParams.get("take") ?? "50", 10);

    if (isNaN(skip) || skip < 0) return error(ErrorCode.VALIDATION, "skip must be a non-negative integer");
    if (isNaN(take) || take < 1 || take > 100) return error(ErrorCode.VALIDATION, "take must be between 1 and 100");

    const cards = await prisma.card.findMany({
      where: { columnId, deletedAt: null },
      orderBy: { position: "asc" },
      skip,
      take,
      include: cardInclude,
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

    const lengthErr = validateLength({ description: body.description });
    if (lengthErr) return error(ErrorCode.VALIDATION, lengthErr);

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
