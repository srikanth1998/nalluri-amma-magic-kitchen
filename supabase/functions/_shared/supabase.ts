import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.110.2";
import { requiredEnv } from "./http.ts";

function secretKey(): string {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return legacy;

  const keys = JSON.parse(requiredEnv("SUPABASE_SECRET_KEYS")) as Record<string, string>;
  const key = keys.default ?? Object.values(keys)[0];
  if (!key) throw new Error("No Supabase secret key is configured");
  return key;
}

function supabaseFetch(apiKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, name) => headers.set(name, value));
    }
    if (apiKey.startsWith("sb_secret_") && headers.get("Authorization") === `Bearer ${apiKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", apiKey);
    return fetch(input, { ...init, headers });
  };
}

export function adminClient(): SupabaseClient {
  const apiKey = secretKey();
  return createClient(requiredEnv("SUPABASE_URL"), apiKey, {
    global: { fetch: supabaseFetch(apiKey) },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function jwtPayload(token: string): Record<string, unknown> | null {
  const part = token.split(".")[1];
  if (!part) return null;
  try {
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
    const payload: unknown = JSON.parse(atob(base64));
    return typeof payload === "object" && payload !== null ? payload as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

export async function optionalUserId(
  supabase: SupabaseClient,
  authorization: string | null,
): Promise<string | null> {
  const token = authorization?.replace(/^Bearer\s+/i, "");
  if (!token || token.startsWith("sb_publishable_")) return null;

  const payload = jwtPayload(token);
  if (payload?.role === "anon" || !payload?.sub) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error) throw new Error("Invalid authentication token");
  return data.user?.id ?? null;
}
