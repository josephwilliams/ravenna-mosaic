import { prisma } from "@/lib/prisma";
import { success, created, error, handleError, ErrorCode } from "@/lib/api";
import { createTagSchema, parseBody } from "@/lib/schemas";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { cards: true } } },
      orderBy: { name: "asc" },
    });
    return success(tags);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = parseBody(createTagSchema, body);
    if ("error" in parsed) return error(ErrorCode.VALIDATION, parsed.error);

    const tag = await prisma.tag.create({
      data: { name: parsed.data.name, color: parsed.data.color },
    });
    return created(tag);
  } catch (err) {
    return handleError(err);
  }
}
