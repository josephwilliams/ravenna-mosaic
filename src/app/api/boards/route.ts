import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const boards = await prisma.board.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(boards);
}

export async function POST(req: Request) {
  const { title } = await req.json();
  const board = await prisma.board.create({
    data: { title },
  });
  return NextResponse.json(board, { status: 201 });
}
