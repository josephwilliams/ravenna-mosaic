import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, error, validate, handleError, ErrorCode } from "@/lib/api";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;
    const body = await req.json();
    const invalid = validate(body, { columnId: "string", position: "number" });
    if (invalid) return error(ErrorCode.VALIDATION, invalid);

    await prisma.$transaction(async (tx) => {
      const column = await tx.column.findUniqueOrThrow({ where: { id: body.columnId } });

      if (body.position > column.position) {
        await tx.column.updateMany({
          where: { boardId, position: { gt: column.position, lte: body.position } },
          data: { position: { decrement: 1 } },
        });
      } else if (body.position < column.position) {
        await tx.column.updateMany({
          where: { boardId, position: { gte: body.position, lt: column.position } },
          data: { position: { increment: 1 } },
        });
      }

      await tx.column.update({
        where: { id: body.columnId },
        data: { position: body.position },
      });
    });

    return success({ reordered: true });
  } catch (err) {
    return handleError(err);
  }
}
