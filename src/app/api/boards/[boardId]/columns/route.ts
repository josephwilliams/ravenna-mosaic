import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, created, error, validate, handleError, ErrorCode } from "@/lib/api";

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
    const invalid = validate(body, { title: "string" });
    if (invalid) return error(ErrorCode.VALIDATION, invalid);

    const maxPos = await prisma.column.aggregate({
      where: { boardId },
      _max: { position: true },
    });

    const column = await prisma.column.create({
      data: {
        boardId,
        title: body.title.trim(),
        position: (maxPos._max.position ?? -1) + 1,
      },
    });
    return created(column);
  } catch (err) {
    return handleError(err);
  }
}
