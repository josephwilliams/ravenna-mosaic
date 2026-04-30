import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.cardTag.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.card.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.column.deleteMany();
  await prisma.board.deleteMany();

  const board = await prisma.board.create({
    data: { title: "Project Board" },
  });

  const backlog = await prisma.column.create({
    data: { boardId: board.id, title: "Backlog", position: 0 },
  });

  const inProgress = await prisma.column.create({
    data: { boardId: board.id, title: "In Progress", position: 1 },
  });

  await prisma.column.create({
    data: { boardId: board.id, title: "Review", position: 2 },
  });

  await prisma.column.create({
    data: { boardId: board.id, title: "Done", position: 3 },
  });

  await prisma.card.createMany({
    data: [
      {
        columnId: backlog.id,
        title: "Set up authentication",
        description: "Add NextAuth with GitHub provider",
        position: 0,
        priority: "HIGH",
      },
      {
        columnId: backlog.id,
        title: "Design landing page",
        description: "Create wireframes and mockups",
        position: 1,
        priority: "MEDIUM",
      },
      {
        columnId: backlog.id,
        title: "Write API documentation",
        position: 2,
        priority: "LOW",
      },
      {
        columnId: backlog.id,
        title: "Add search functionality",
        description: "Full-text search across cards",
        position: 3,
        priority: "MEDIUM",
      },
      {
        columnId: inProgress.id,
        title: "Build kanban board UI",
        description: "Drag and drop columns and cards",
        position: 0,
        priority: "HIGH",
      },
    ],
  });

  console.log("Seeded: 1 board, 4 columns, 5 cards");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
