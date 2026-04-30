import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, created, error, validate, handleError, ErrorCode } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/cards/[cardId]/comments">
) {
  try {
    const { cardId } = await ctx.params;
    const comments = await prisma.comment.findMany({
      where: { cardId },
      orderBy: { createdAt: "asc" },
    });
    return success(comments);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/cards/[cardId]/comments">
) {
  try {
    const { cardId } = await ctx.params;
    const body = await req.json();
    const invalid = validate(body, { content: "string" });
    if (invalid) return error(ErrorCode.VALIDATION, invalid);

    const comment = await prisma.comment.create({
      data: { cardId, author: "Anonymous", content: body.content.trim() },
    });
    return created(comment);
  } catch (err) {
    return handleError(err);
  }
}
