/**
 * Auth utilities — usa Web Crypto API (compativel com Edge Runtime e Node.js)
 */

const AUTH_SECRET = process.env.AUTH_SECRET ?? "elmisti-influencer-2026-secret";
const ADMIN_USER = process.env.ADMIN_USER ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "dany2000";

export const COOKIE_NAME = "elmisti-session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias

async function signPayload(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + SESSION_DURATION;
  const payload = `${ADMIN_USER}:${expires}`;
  const signature = await signPayload(payload);
  return `${payload}:${signature}`;
}

export async function validateSessionToken(token: string): Promise<boolean> {
  const parts = token.split(":");
  if (parts.length !== 3) return false;

  const [, expiresStr, signature] = parts;
  const payload = `${parts[0]}:${expiresStr}`;
  const expectedSig = await signPayload(payload);

  if (signature !== expectedSig) return false;
  if (Date.now() > Number(expiresStr)) return false;

  return true;
}

export function validateCredentials(user: string, password: string): boolean {
  return user === ADMIN_USER && password === ADMIN_PASSWORD;
}
