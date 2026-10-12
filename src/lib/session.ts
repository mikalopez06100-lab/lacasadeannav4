/**
 * Session admin : cookie signé HMAC-SHA256 (Web Crypto → utilisable dans le middleware
 * Edge comme côté serveur). Contenu : e-mail + date d'expiration. Pas de table de sessions.
 */

export const SESSION_COOKIE = "lcda_admin";
export const SESSION_DAYS = 30;

const enc = new TextEncoder();

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV !== "production") return "dev-only-secret-not-for-production-use";
  return null; // en production sans secret : l'admin est fermé
}

const b64url = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromB64url = (s: string) =>
  Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function hmac(data: string, key: string) {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  return b64url(await crypto.subtle.sign("HMAC", k, enc.encode(data)));
}

export async function signSession(email: string) {
  const key = secret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET manquant");
  const payload = b64url(enc.encode(JSON.stringify({ email, exp: Date.now() + SESSION_DAYS * 864e5 })));
  return `${payload}.${await hmac(payload, key)}`;
}

/** Renvoie l'e-mail de la session si le cookie est valide et non expiré, sinon null. */
export async function verifySession(token: string | undefined | null): Promise<string | null> {
  const key = secret();
  if (!key || !token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = await hmac(payload, key);
  // comparaison à temps constant
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    const { email, exp } = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as {
      email: string;
      exp: number;
    };
    if (typeof exp !== "number" || exp < Date.now()) return null;
    return adminEmails().includes(email) ? email : null;
  } catch {
    return null;
  }
}

/** Adresses autorisées (ADMIN_EMAILS, séparées par des virgules). */
export function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "decoration@lacasadeanna.com,coline@lacasadeanna.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
