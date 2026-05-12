import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, created, error, handleError, ErrorCode } from "@/lib/api";
import { commentSchema, parseBody } from "@/lib/schemas";

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
    const parsed = parseBody(commentSchema, body);
    if ("error" in parsed) return error(ErrorCode.VALIDATION, parsed.error);

    const comment = await prisma.comment.create({
      data: { cardId, author: "Anonymous", content: parsed.data.content },
    });
    return created(comment);
  } catch (err) {
    return handleError(err);
  }
}
