import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { cards: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(tags);
}

export async function POST(req: Request) {
  const { name, color } = await req.json();
  const tag = await prisma.tag.create({
    data: { name, color },
  });
  return NextResponse.json(tag, { status: 201 });
}
