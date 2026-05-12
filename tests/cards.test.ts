import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma, createTestBoard, createTestColumn, createTestCard, cleanup } from "./helpers";
import { buildRequest, apiCall } from "./request";
import { GET as LIST, POST } from "@/app/api/boards/[boardId]/columns/[columnId]/cards/route";
import { GET, PATCH, DELETE } from "@/app/api/boards/[boardId]/columns/[columnId]/cards/[cardId]/route";
import { PATCH as REORDER } from "@/app/api/boards/[boardId]/columns/[columnId]/cards/reorder/route";
import { PATCH as MOVE } from "@/app/api/cards/[cardId]/move/route";

let boardId: string;
let colAId: string;
let colBId: string;
let cardId: string;

beforeAll(async () => {
  const board = await createTestBoard("Cards Test");
  boardId = board.id;
  const colA = await createTestColumn(boardId, "Col A", 0);
  const colB = await createTestColumn(boardId, "Col B", 1);
  colAId = colA.id;
  colBId = colB.id;
});

afterAll(async () => {
  await cleanup(boardId);
  await prisma.$disconnect();
});

describe("POST /cards", () => {
  it("creates a card with defaults", async () => {
    const { status, body } = await apiCall(
      POST,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards`, {
        method: "POST",
        body: { title: "First Card" },
      }),
      { boardId, columnId: colAId }
    );
    expect(status).toBe(201);
    expect(body.data.title).toBe("First Card");
    expect(body.data.priority).toBe("MEDIUM");
    expect(body.data.position).toBe(0);
    cardId = body.data.id;
  });

  it("creates a card with explicit priority", async () => {
    const { status, body } = await apiCall(
      POST,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards`, {
        method: "POST",
        body: { title: "Urgent", priority: "HIGH" },
      }),
      { boardId, columnId: colAId }
    );
    expect(status).toBe(201);
    expect(body.data.priority).toBe("HIGH");
    expect(body.data.position).toBe(1);
  });

  it("rejects missing title", async () => {
    const { status, body } = await apiCall(
      POST,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards`, {
        method: "POST",
        body: {},
      }),
      { boardId, columnId: colAId }
    );
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
  });

  it("rejects title exceeding max length", async () => {
    const { status, body } = await apiCall(
      POST,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards`, {
        method: "POST",
        body: { title: "x".repeat(201) },
      }),
      { boardId, columnId: colAId }
    );
    expect(status).toBe(400);
    expect(body.error.message).toContain("<=200");
  });

  it("rejects description exceeding max length", async () => {
    const { status, body } = await apiCall(
      POST,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards`, {
        method: "POST",
        body: { title: "Valid", description: "x".repeat(2001) },
      }),
      { boardId, columnId: colAId }
    );
    expect(status).toBe(400);
    expect(body.error.message).toContain("<=2000");
  });

  it("rejects invalid priority", async () => {
    const { status, body } = await apiCall(
      POST,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards`, {
        method: "POST",
        body: { title: "Bad", priority: "URGENT" },
      }),
      { boardId, columnId: colAId }
    );
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
  });
});

describe("GET /cards", () => {
  it("lists cards in a column", async () => {
    const { status, body } = await apiCall(
      LIST,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards`),
      { boardId, columnId: colAId }
    );
    expect(status).toBe(200);
    expect(body.data.length).toBeGreaterThanOrEqual(2);
  });

  it("paginates with skip and take", async () => {
    for (let i = 0; i < 6; i++) {
      await createTestCard(colAId, { title: `Page ${i}`, position: 10 + i });
    }

    const first = await apiCall(
      LIST,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards`, { searchParams: { take: "3", skip: "0" } }),
      { boardId, columnId: colAId }
    );
    expect(first.status).toBe(200);
    expect(first.body.data.length).toBe(3);

    const second = await apiCall(
      LIST,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards`, { searchParams: { take: "3", skip: "3" } }),
      { boardId, columnId: colAId }
    );
    expect(second.status).toBe(200);
    expect(second.body.data.length).toBe(3);

    expect(first.body.data[0].id).not.toBe(second.body.data[0].id);
  });
});

describe("GET /cards/[cardId]", () => {
  it("returns card with tags and comments", async () => {
    const { status, body } = await apiCall(
      GET,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards/${cardId}`),
      { boardId, columnId: colAId, cardId }
    );
    expect(status).toBe(200);
    expect(body.data.id).toBe(cardId);
    expect(Array.isArray(body.data.tags)).toBe(true);
    expect(Array.isArray(body.data.comments)).toBe(true);
  });

  it("returns 404 for missing card", async () => {
    const { status, body } = await apiCall(
      GET,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards/nonexistent`),
      { boardId, columnId: colAId, cardId: "nonexistent" }
    );
    expect(status).toBe(404);
    expect(body.error.code).toBe("NOT_FOUND");
  });
});

describe("PATCH /cards/[cardId]", () => {
  it("updates title and priority", async () => {
    const { status, body } = await apiCall(
      PATCH,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards/${cardId}`, {
        method: "PATCH",
        body: { title: "Updated", priority: "LOW" },
      }),
      { boardId, columnId: colAId, cardId }
    );
    expect(status).toBe(200);
    expect(body.data.title).toBe("Updated");
    expect(body.data.priority).toBe("LOW");
  });

  it("rejects invalid priority on update", async () => {
    const { status, body } = await apiCall(
      PATCH,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards/${cardId}`, {
        method: "PATCH",
        body: { priority: "NOPE" },
      }),
      { boardId, columnId: colAId, cardId }
    );
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
  });
});

describe("DELETE /cards/[cardId] (soft delete)", () => {
  it("soft-deletes the card", async () => {
    const { status, body } = await apiCall(
      DELETE,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards/${cardId}`, { method: "DELETE" }),
      { boardId, columnId: colAId, cardId }
    );
    expect(status).toBe(200);
    expect(body.data.deletedAt).not.toBeNull();
  });

  it("soft-deleted card is excluded from list", async () => {
    const { body } = await apiCall(
      LIST,
      buildRequest(`/api/boards/${boardId}/columns/${colAId}/cards`),
      { boardId, columnId: colAId }
    );
    const ids = body.data.map((c: { id: string }) => c.id);
    expect(ids).not.toContain(cardId);
  });
});

describe("PATCH /cards/[cardId]/move", () => {
  it("moves a card between columns", async () => {
    const card = await createTestCard(colAId, { title: "Mover", position: 99 });
    const { status, body } = await apiCall(
      MOVE,
      buildRequest(`/api/cards/${card.id}/move`, {
        method: "PATCH",
        body: { columnId: colBId, position: 0 },
      }),
      { cardId: card.id }
    );
    expect(status).toBe(200);
    expect(body.data.moved).toBe(true);

    const moved = await prisma.card.findUnique({ where: { id: card.id } });
    expect(moved!.columnId).toBe(colBId);
  });

  it("rejects missing fields", async () => {
    const { status, body } = await apiCall(
      MOVE,
      buildRequest(`/api/cards/fake/move`, { method: "PATCH", body: {} }),
      { cardId: "fake" }
    );
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
  });
});

describe("PATCH /cards/reorder", () => {
  it("batch reorders cards", async () => {
    const c1 = await createTestCard(colBId, { title: "R1", position: 0 });
    const c2 = await createTestCard(colBId, { title: "R2", position: 1 });

    const { status, body } = await apiCall(
      REORDER,
      buildRequest(`/api/boards/${boardId}/columns/${colBId}/cards/reorder`, {
        method: "PATCH",
        body: { cardIds: [c2.id, c1.id] },
      }),
      { boardId, columnId: colBId }
    );
    expect(status).toBe(200);
    expect(body.data.reordered).toBe(true);

    const updated1 = await prisma.card.findUnique({ where: { id: c1.id } });
    const updated2 = await prisma.card.findUnique({ where: { id: c2.id } });
    expect(updated2!.position).toBe(0);
    expect(updated1!.position).toBe(1);
  });
});
