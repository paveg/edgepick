/**
 * Fetch from the Edgepick API.
 *
 * In production (Cloudflare Workers), uses the Service Binding to avoid
 * cross-worker fetch issues (error 1042). In development, falls back to
 * a regular HTTP fetch to localhost.
 */
import { env } from "cloudflare:workers";

const binding = (env as Record<string, unknown>).API as { fetch: typeof fetch } | undefined;

export const apiFetch = (path: string, init?: RequestInit): Promise<Response> => {
  if (binding) {
    return binding.fetch(new Request(`https://api${path}`, init));
  }
  const baseUrl = import.meta.env.API_URL || "http://localhost:8787";
  return fetch(`${baseUrl}${path}`, init);
};
