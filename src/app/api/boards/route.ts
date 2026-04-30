import { prisma } from "@/lib/prisma";
import { success, created, error, validate, handleError, ErrorCode } from "@/lib/api";

export async function GET() {
  try {
    const boards = await prisma.board.findMany({ orderBy: { createdAt: "desc" } });
    return success(boards);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const invalid = validate(body, { title: "string" });
    if (invalid) return error(ErrorCode.VALIDATION, invalid);

    const board = await prisma.board.create({ data: { title: body.title.trim() } });
    return created(board);
  } catch (err) {
    return handleError(err);
  }
}
