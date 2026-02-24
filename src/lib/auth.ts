/**
 * Auth utilities — usa Web Crypto API (compativel com Edge Runtime e Node.js)
 */

const AUTH_SECRET = process.env.AUTH_SECRET;
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const COOKIE_NAME = "elmisti-session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias

async function signPayload(payload: string): Promise<string> {
  if (!AUTH_SECRET) throw new Error("AUTH_SECRET nao configurado");
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

  // Timing-safe comparison para evitar timing attacks
  if (signature.length !== expectedSig.length) return false;
  const encoder = new TextEncoder();
  const a = encoder.encode(signature);
  const b = encoder.encode(expectedSig);
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  if (diff !== 0) return false;
  if (Date.now() > Number(expiresStr)) return false;

  return true;
}

export function validateCredentials(user: string, password: string): boolean {
  if (!ADMIN_USER || !ADMIN_PASSWORD) return false;
  return user === ADMIN_USER && password === ADMIN_PASSWORD;
}
