import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, error, handleError, ErrorCode } from "@/lib/api";
import { moveSchema, parseBody } from "@/lib/schemas";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;
    const body = await req.json();
    const parsed = parseBody(moveSchema, body);
    if ("error" in parsed) return error(ErrorCode.VALIDATION, parsed.error);

    await prisma.$transaction(async (tx) => {
      const column = await tx.column.findUniqueOrThrow({ where: { id: parsed.data.columnId } });

      if (parsed.data.position > column.position) {
        await tx.column.updateMany({
          where: { boardId, position: { gt: column.position, lte: parsed.data.position } },
          data: { position: { decrement: 1 } },
        });
      } else if (parsed.data.position < column.position) {
        await tx.column.updateMany({
          where: { boardId, position: { gte: parsed.data.position, lt: column.position } },
          data: { position: { increment: 1 } },
        });
      }

      await tx.column.update({
        where: { id: parsed.data.columnId },
        data: { position: parsed.data.position },
      });
    });

    return success({ reordered: true });
  } catch (err) {
    return handleError(err);
  }
}
