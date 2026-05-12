import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, created, error, handleError, ErrorCode } from "@/lib/api";
import { titleSchema, parseBody } from "@/lib/schemas";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns">
) {
  try {
    const { boardId } = await ctx.params;
    const columns = await prisma.column.findMany({
      where: { boardId },
      orderBy: { position: "asc" },
    });
    return success(columns);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/boards/[boardId]/columns">
) {
  try {
    const { boardId } = await ctx.params;
    const body = await req.json();
    const parsed = parseBody(titleSchema, body);
    if ("error" in parsed) return error(ErrorCode.VALIDATION, parsed.error);

    const maxPos = await prisma.column.aggregate({
      where: { boardId },
      _max: { position: true },
    });

    const column = await prisma.column.create({
      data: {
        boardId,
        title: parsed.data.title,
        position: (maxPos._max.position ?? -1) + 1,
      },
    });
    return created(column);
  } catch (err) {
    return handleError(err);
  }
}
