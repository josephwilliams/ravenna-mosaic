import { describe, it, expect, afterAll } from "vitest";
import { prisma, createTestBoard, cleanup } from "./helpers";
import { buildRequest, apiCall } from "./request";
import { GET, POST } from "@/app/api/boards/route";
import { GET as GET_ONE, PATCH, DELETE } from "@/app/api/boards/[boardId]/route";

let boardId: string;

afterAll(async () => {
  if (boardId) await cleanup(boardId);
  await prisma.$disconnect();
});

describe("GET /api/boards", () => {
  it("returns { data: [...] }", async () => {
    const { status, body } = await apiCall(GET, buildRequest("/api/boards"));
    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
  });
});

describe("POST /api/boards", () => {
  it("creates a board", async () => {
    const { status, body } = await apiCall(POST, buildRequest("/api/boards", {
      method: "POST",
      body: { title: "API Test Board" },
    }));
    expect(status).toBe(201);
    expect(body.data.title).toBe("API Test Board");
    boardId = body.data.id;
  });

  it("rejects empty title", async () => {
    const { status, body } = await apiCall(POST, buildRequest("/api/boards", {
      method: "POST",
      body: { title: "" },
    }));
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
  });

  it("rejects missing title", async () => {
    const { status, body } = await apiCall(POST, buildRequest("/api/boards", {
      method: "POST",
      body: {},
    }));
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
  });
});

describe("GET /api/boards/[boardId]", () => {
  it("returns board with columns", async () => {
    const { status, body } = await apiCall(
      GET_ONE,
      buildRequest(`/api/boards/${boardId}`),
      { boardId }
    );
    expect(status).toBe(200);
    expect(body.data.id).toBe(boardId);
    expect(Array.isArray(body.data.columns)).toBe(true);
  });

  it("returns 404 for missing board", async () => {
    const { status, body } = await apiCall(
      GET_ONE,
      buildRequest("/api/boards/nonexistent"),
      { boardId: "nonexistent" }
    );
    expect(status).toBe(404);
    expect(body.error.code).toBe("NOT_FOUND");
  });
});

describe("PATCH /api/boards/[boardId]", () => {
  it("updates the title", async () => {
    const { status, body } = await apiCall(
      PATCH,
      buildRequest(`/api/boards/${boardId}`, { method: "PATCH", body: { title: "Renamed" } }),
      { boardId }
    );
    expect(status).toBe(200);
    expect(body.data.title).toBe("Renamed");
  });

  it("rejects empty title", async () => {
    const { status, body } = await apiCall(
      PATCH,
      buildRequest(`/api/boards/${boardId}`, { method: "PATCH", body: { title: "" } }),
      { boardId }
    );
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
  });
});

describe("DELETE /api/boards/[boardId]", () => {
  it("deletes the board", async () => {
    const tempBoard = await createTestBoard("To Delete");
    const { status, body } = await apiCall(
      DELETE,
      buildRequest(`/api/boards/${tempBoard.id}`, { method: "DELETE" }),
      { boardId: tempBoard.id }
    );
    expect(status).toBe(200);
    expect(body.data.deleted).toBe(true);
  });
});
