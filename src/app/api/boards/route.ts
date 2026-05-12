import { prisma } from "@/lib/prisma";
import { success, created, error, handleError, ErrorCode } from "@/lib/api";
import { titleSchema, parseBody } from "@/lib/schemas";

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
    const parsed = parseBody(titleSchema, body);
    if ("error" in parsed) return error(ErrorCode.VALIDATION, parsed.error);

    const board = await prisma.board.create({ data: { title: parsed.data.title } });
    return created(board);
  } catch (err) {
    return handleError(err);
  }
}
