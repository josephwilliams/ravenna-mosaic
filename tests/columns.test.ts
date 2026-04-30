import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma, createTestBoard, createTestColumn, createTestCard, cleanup } from "./helpers";
import { buildRequest, apiCall } from "./request";
import { GET, POST } from "@/app/api/boards/[boardId]/columns/route";
import { PATCH, DELETE } from "@/app/api/boards/[boardId]/columns/[columnId]/route";
import { PATCH as REORDER } from "@/app/api/boards/[boardId]/columns/reorder/route";

let boardId: string;
let columnId: string;

beforeAll(async () => {
  const board = await createTestBoard("Columns Test");
  boardId = board.id;
});

afterAll(async () => {
  await cleanup(boardId);
  await prisma.$disconnect();
});

describe("POST /api/boards/[boardId]/columns", () => {
  it("creates a column with auto-position", async () => {
    const { status, body } = await apiCall(
      POST,
      buildRequest(`/api/boards/${boardId}/columns`, { method: "POST", body: { title: "Col A" } }),
      { boardId }
    );
    expect(status).toBe(201);
    expect(body.data.title).toBe("Col A");
    expect(body.data.position).toBe(0);
    columnId = body.data.id;
  });

  it("auto-increments position", async () => {
    const { body } = await apiCall(
      POST,
      buildRequest(`/api/boards/${boardId}/columns`, { method: "POST", body: { title: "Col B" } }),
      { boardId }
    );
    expect(body.data.position).toBe(1);
  });

  it("rejects missing title", async () => {
    const { status, body } = await apiCall(
      POST,
      buildRequest(`/api/boards/${boardId}/columns`, { method: "POST", body: {} }),
      { boardId }
    );
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
  });
});

describe("GET /api/boards/[boardId]/columns", () => {
  it("lists columns in order", async () => {
    const { status, body } = await apiCall(
      GET,
      buildRequest(`/api/boards/${boardId}/columns`),
      { boardId }
    );
    expect(status).toBe(200);
    expect(body.data.length).toBeGreaterThanOrEqual(2);
    expect(body.data[0].position).toBeLessThan(body.data[1].position);
  });
});

describe("PATCH /api/boards/[boardId]/columns/[columnId]", () => {
  it("renames the column", async () => {
    const { status, body } = await apiCall(
      PATCH,
      buildRequest(`/api/boards/${boardId}/columns/${columnId}`, { method: "PATCH", body: { title: "Renamed" } }),
      { boardId, columnId }
    );
    expect(status).toBe(200);
    expect(body.data.title).toBe("Renamed");
  });
});

describe("DELETE /api/boards/[boardId]/columns/[columnId]", () => {
  it("returns 409 when column has cards", async () => {
    await createTestCard(columnId);
    const { status, body } = await apiCall(
      DELETE,
      buildRequest(`/api/boards/${boardId}/columns/${columnId}`, { method: "DELETE" }),
      { boardId, columnId }
    );
    expect(status).toBe(409);
    expect(body.error.code).toBe("CONFLICT");
  });

  it("deletes empty column", async () => {
    const col = await createTestColumn(boardId, "Empty", 99);
    const { status, body } = await apiCall(
      DELETE,
      buildRequest(`/api/boards/${boardId}/columns/${col.id}`, { method: "DELETE" }),
      { boardId, columnId: col.id }
    );
    expect(status).toBe(200);
    expect(body.data.deleted).toBe(true);
  });
});

describe("PATCH /api/boards/[boardId]/columns/reorder", () => {
  it("reorders columns", async () => {
    const { body: listBody } = await apiCall(
      GET,
      buildRequest(`/api/boards/${boardId}/columns`),
      { boardId }
    );
    const lastCol = listBody.data[listBody.data.length - 1];

    const { status, body } = await apiCall(
      REORDER,
      buildRequest(`/api/boards/${boardId}/columns/reorder`, {
        method: "PATCH",
        body: { columnId: lastCol.id, position: 0 },
      }),
      { boardId }
    );
    expect(status).toBe(200);
    expect(body.data.reordered).toBe(true);
  });

  it("rejects missing fields", async () => {
    const { status, body } = await apiCall(
      REORDER,
      buildRequest(`/api/boards/${boardId}/columns/reorder`, {
        method: "PATCH",
        body: {},
      }),
      { boardId }
    );
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
  });
});
