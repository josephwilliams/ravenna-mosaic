import { PrismaClient, Priority } from "@prisma/client";

export const prisma = new PrismaClient();

export async function createTestBoard(title = "Test Board") {
  return prisma.board.create({ data: { title } });
}

export async function createTestColumn(boardId: string, title = "Test Column", position = 0) {
  return prisma.column.create({ data: { boardId, title, position } });
}

export async function createTestCard(
  columnId: string,
  overrides: { title?: string; position?: number; priority?: Priority } = {}
) {
  return prisma.card.create({
    data: {
      columnId,
      title: overrides.title ?? "Test Card",
      position: overrides.position ?? 0,
      priority: overrides.priority ?? "MEDIUM",
    },
  });
}

export async function createTestTag(name: string, color = "#b85c38") {
  return prisma.tag.create({ data: { name, color } });
}

export async function createTestComment(cardId: string, content = "Test comment") {
  return prisma.comment.create({ data: { cardId, author: "Tester", content } });
}

export async function cleanup(boardId: string, tagIds: string[] = []) {
  await prisma.board.delete({ where: { id: boardId } }).catch(() => {});
  for (const id of tagIds) {
    await prisma.tag.delete({ where: { id } }).catch(() => {});
  }
}
