import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export enum ErrorCode {
  NOT_FOUND = "NOT_FOUND",
  VALIDATION = "VALIDATION",
  CONFLICT = "CONFLICT",
  INTERNAL = "INTERNAL",
}

const STATUS_MAP: Record<ErrorCode, number> = {
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.VALIDATION]: 400,
  [ErrorCode.CONFLICT]: 409,
  [ErrorCode.INTERNAL]: 500,
};

interface ApiError {
  code: ErrorCode;
  message: string;
}

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function created<T>(data: T) {
  return success(data, 201);
}

export function error(code: ErrorCode, message: string) {
  return NextResponse.json(
    { error: { code, message } } satisfies { error: ApiError },
    { status: STATUS_MAP[code] }
  );
}

export function validate(
  fields: Record<string, unknown>,
  rules: Record<string, "string" | "string?" | "number" | "string[]">
): string | null {
  for (const [key, rule] of Object.entries(rules)) {
    const value = fields[key];
    if (rule === "string") {
      if (typeof value !== "string" || value.trim().length === 0)
        return `${key} is required`;
    }
    if (rule === "number") {
      if (typeof value !== "number" || !Number.isFinite(value))
        return `${key} must be a number`;
    }
    if (rule === "string[]") {
      if (!Array.isArray(value) || !value.every((v) => typeof v === "string"))
        return `${key} must be an array of strings`;
    }
  }
  return null;
}

const VALID_PRIORITIES = new Set(["HIGH", "MEDIUM", "LOW"]);

export function validatePriority(value: unknown): string | null {
  if (value !== undefined && (typeof value !== "string" || !VALID_PRIORITIES.has(value)))
    return "priority must be HIGH, MEDIUM, or LOW";
  return null;
}

export function handleError(err: unknown) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025")
      return error(ErrorCode.NOT_FOUND, "Record not found");
    if (err.code === "P2002")
      return error(ErrorCode.CONFLICT, "Record already exists");
    if (err.code === "P2003")
      return error(ErrorCode.VALIDATION, "Referenced record does not exist");
  }
  console.error(err);
  return error(ErrorCode.INTERNAL, "Internal server error");
}
