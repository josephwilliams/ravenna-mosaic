import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma, createTestBoard, createTestColumn, createTestCard, createTestTag, cleanup } from "./helpers";
import { buildRequest, apiCall } from "./request";
import { GET, POST } from "@/app/api/tags/route";
import { DELETE } from "@/app/api/tags/[tagId]/route";
import { PUT } from "@/app/api/cards/[cardId]/tags/route";

let boardId: string;
let cardId: string;
let tagId: string;
const tagIds: string[] = [];

beforeAll(async () => {
  const board = await createTestBoard("Tags Test");
  boardId = board.id;
  const col = await createTestColumn(boardId, "Col", 0);
  const card = await createTestCard(col.id);
  cardId = card.id;
});

afterAll(async () => {
  await cleanup(boardId, tagIds);
  await prisma.$disconnect();
});

describe("POST /api/tags", () => {
  it("creates a tag", async () => {
    const { status, body } = await apiCall(
      POST,
      buildRequest("/api/tags", { method: "POST", body: { name: "TestTag", color: "#ff0000" } })
    );
    expect(status).toBe(201);
    expect(body.data.name).toBe("TestTag");
    expect(body.data.color).toBe("#ff0000");
    tagId = body.data.id;
    tagIds.push(tagId);
  });

  it("rejects missing name", async () => {
    const { status, body } = await apiCall(
      POST,
      buildRequest("/api/tags", { method: "POST", body: { color: "#000" } })
    );
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
  });

  it("rejects missing color", async () => {
    const { status, body } = await apiCall(
      POST,
      buildRequest("/api/tags", { method: "POST", body: { name: "NoColor" } })
    );
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
  });
});

describe("GET /api/tags", () => {
  it("lists tags with usage count", async () => {
    const { status, body } = await apiCall(GET, buildRequest("/api/tags"));
    expect(status).toBe(200);
    const tag = body.data.find((t: { id: string }) => t.id === tagId);
    expect(tag).toBeDefined();
    expect(tag._count.cards).toBe(0);
  });
});

describe("PUT /api/cards/[cardId]/tags", () => {
  it("assigns tags to a card", async () => {
    const { status, body } = await apiCall(
      PUT,
      buildRequest(`/api/cards/${cardId}/tags`, { method: "PUT", body: { tagIds: [tagId] } }),
      { cardId }
    );
    expect(status).toBe(200);
    expect(body.data.updated).toBe(true);
  });

  it("replaces tags", async () => {
    const tag2 = await createTestTag("TestTag2", "#00ff00");
    tagIds.push(tag2.id);

    const { status } = await apiCall(
      PUT,
      buildRequest(`/api/cards/${cardId}/tags`, { method: "PUT", body: { tagIds: [tag2.id] } }),
      { cardId }
    );
    expect(status).toBe(200);

    const assignments = await prisma.cardTag.findMany({ where: { cardId } });
    expect(assignments.length).toBe(1);
    expect(assignments[0].tagId).toBe(tag2.id);
  });

  it("rejects invalid tagIds", async () => {
    const { status, body } = await apiCall(
      PUT,
      buildRequest(`/api/cards/${cardId}/tags`, { method: "PUT", body: { tagIds: "not-array" } }),
      { cardId }
    );
    expect(status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
  });
});

describe("DELETE /api/tags/[tagId]", () => {
  it("returns 409 when tag is in use", async () => {
    await prisma.cardTag.create({ data: { cardId, tagId } });
    const { status, body } = await apiCall(
      DELETE,
      buildRequest(`/api/tags/${tagId}`, { method: "DELETE" }),
      { tagId }
    );
    expect(status).toBe(409);
    expect(body.error.code).toBe("CONFLICT");
  });

  it("deletes unused tag", async () => {
    const unused = await createTestTag("Unused", "#999");
    tagIds.push(unused.id);
    const { status, body } = await apiCall(
      DELETE,
      buildRequest(`/api/tags/${unused.id}`, { method: "DELETE" }),
      { tagId: unused.id }
    );
    expect(status).toBe(200);
    expect(body.data.deleted).toBe(true);
    tagIds.pop();
  });
});
