export async function fetchJSON<T = unknown>(
  url: string,
  options?: { method?: string; body?: unknown }
): Promise<{ ok: boolean; status: number; data: T }> {
  const init: RequestInit = { method: options?.method ?? "GET" };
  if (options?.body) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(options.body);
  }
  const res = await fetch(url, init);
  const json = await res.json();
  return { ok: res.ok, status: res.status, data: json.data };
}
