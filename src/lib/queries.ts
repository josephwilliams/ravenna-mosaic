import { Prisma } from "@prisma/client";

export const cardInclude = {
  tags: { include: { tag: true } },
  _count: { select: { comments: true } },
} satisfies Prisma.CardInclude;
