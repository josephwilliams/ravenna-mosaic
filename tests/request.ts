import { NextRequest } from "next/server";

const BASE = "http://localhost:3000";

export function buildRequest(path: string, options?: { method?: string; body?: unknown; searchParams?: Record<string, string | string[]> }) {
  const url = new URL(path, BASE);
  if (options?.searchParams) {
    for (const [key, val] of Object.entries(options.searchParams)) {
      if (Array.isArray(val)) {
        for (const v of val) url.searchParams.append(key, v);
      } else {
        url.searchParams.set(key, val);
      }
    }
  }

  return new NextRequest(url, {
    method: options?.method ?? "GET",
    ...(options?.body && {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options.body),
    }),
  });
}

export async function apiCall(handler: Function, req: NextRequest, params: Record<string, string> = {}) {
  const ctx = { params: Promise.resolve(params) };
  const res = await handler(req, ctx);
  const json = await res.json();
  return { status: res.status, body: json };
}
