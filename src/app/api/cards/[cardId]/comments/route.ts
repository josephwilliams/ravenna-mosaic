import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/cards/[cardId]/comments">
) {
  const { cardId } = await ctx.params;
  const comments = await prisma.comment.findMany({
    where: { cardId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/cards/[cardId]/comments">
) {
  const { cardId } = await ctx.params;
  const { content } = await req.json();
  const comment = await prisma.comment.create({
    data: { cardId, author: "Anonymous", content },
  });
  return NextResponse.json(comment, { status: 201 });
}
