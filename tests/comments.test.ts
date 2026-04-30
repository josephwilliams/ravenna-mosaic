import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma, createTestBoard, createTestColumn, createTestCard, cleanup } from "./helpers";
import { buildRequest, apiCall } from "./request";
import { GET, POST } from "@/app/api/cards/[cardId]/comments/route";
import { DELETE } from "@/app/api/comments/[commentId]/route";

let boardId: string;
let cardId: string;
let commentId: string;

beforeAll(async () => {
  const board = await createTestBoard("Comments Test");
  boardId = board.id;
  const col = await createTestColumn(boardId, "Col", 0);
  const card = await createTestCard(col.id);
  cardId = card.id;
});

afterAll(async () => {
  await cleanup(boardId);
  await prisma.$disconnect();
});

describe("POST /api/cards/[cardId]/comments", () => {
  it("creates a comment", async () => {
    const { status, body } = await apiCall(
      POST,
      buildRequest(`/api/cards/${cardId}/comments`, {
        method: "POST",
        body: { content: "A remark" },
      }),
      { cardId }
    );
    expect(status).toBe(201);
    expect(body.data.content).toBe("A remark");
    expect(body.data.author).toBe("Anonymous");
    commentId = body.data.id;
  });

  it("rejects empty content", async () => {
    const { status, body } = await apiCall(
      POST,
      buildRequest(`/api/cards/${cardId}/comments`, {
        method: "POST",
        body: { content: "" },
      }),
      { cardId }
    );
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
  });

  it("rejects missing content", async () => {
    const { status, body } = await apiCall(
      POST,
      buildRequest(`/api/cards/${cardId}/comments`, {
        method: "POST",
        body: {},
      }),
      { cardId }
    );
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
  });
});

describe("GET /api/cards/[cardId]/comments", () => {
  it("lists comments in order", async () => {
    const { status, body } = await apiCall(
      GET,
      buildRequest(`/api/cards/${cardId}/comments`),
      { cardId }
    );
    expect(status).toBe(200);
    expect(body.data.length).toBeGreaterThanOrEqual(1);
    expect(body.data[0].id).toBe(commentId);
  });
});

describe("DELETE /api/comments/[commentId]", () => {
  it("hard-deletes the comment", async () => {
    const { status, body } = await apiCall(
      DELETE,
      buildRequest(`/api/comments/${commentId}`, { method: "DELETE" }),
      { commentId }
    );
    expect(status).toBe(200);
    expect(body.data.deleted).toBe(true);

    const gone = await prisma.comment.findUnique({ where: { id: commentId } });
    expect(gone).toBeNull();
  });

  it("returns 404 for missing comment", async () => {
    const { status, body } = await apiCall(
      DELETE,
      buildRequest(`/api/comments/nonexistent`, { method: "DELETE" }),
      { commentId: "nonexistent" }
    );
    expect(status).toBe(404);
    expect(body.error.code).toBe("NOT_FOUND");
  });
});
