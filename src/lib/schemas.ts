import { z } from "zod/v4";

export const titleSchema = z.object({
  title: z.string().trim().min(1).max(200),
});

export const createCardSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
});

export const updateCardSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  deletedAt: z.string().nullable().optional(),
});

export const moveSchema = z.object({
  columnId: z.string().min(1),
  position: z.number().int(),
});

export const reorderCardsSchema = z.object({
  cardIds: z.array(z.string()),
  columnId: z.string().min(1).optional(),
});

export const tagIdsSchema = z.object({
  tagIds: z.array(z.string()),
});

export const createTagSchema = z.object({
  name: z.string().trim().min(1).max(100),
  color: z.string().min(1).max(20),
});

export const commentSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

export function parseBody<T>(schema: z.ZodType<T>, data: unknown): { data: T } | { error: string } {
  const result = schema.safeParse(data);
  if (result.success) return { data: result.data };
  return { error: result.error.issues[0].message };
}
