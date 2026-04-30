import { prisma } from "@/lib/prisma";
import { success, created, error, validate, handleError, ErrorCode } from "@/lib/api";

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
    const invalid = validate(body, { name: "string", color: "string" });
    if (invalid) return error(ErrorCode.VALIDATION, invalid);

    const tag = await prisma.tag.create({
      data: { name: body.name.trim(), color: body.color.trim() },
    });
    return created(tag);
  } catch (err) {
    return handleError(err);
  }
}
