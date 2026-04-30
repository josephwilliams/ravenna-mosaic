import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { success, error, validate, handleError, ErrorCode } from "@/lib/api";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string; columnId: string }> }
) {
  try {
    await params;
    const body = await req.json();
    const invalid = validate(body, { cardIds: "string[]" });
    if (invalid) return error(ErrorCode.VALIDATION, invalid);

    await prisma.$transaction(
      body.cardIds.map((id: string, position: number) =>
        prisma.card.update({ where: { id }, data: { position } })
      )
    );

    return success({ reordered: true });
  } catch (err) {
    return handleError(err);
  }
}
