import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { getSql } from "@/lib/db";
import { site } from "@/content/site";
import { adminEmails, SESSION_COOKIE, SESSION_DAYS, signSession, verifySession } from "@/lib/session";

/**
 * Connexion admin par lien magique :
 * 1. l'utilisatrice saisit son e-mail (doit figurer dans ADMIN_EMAILS) ;
 * 2. on stocke le hash d'un jeton aléatoire (valable 15 min, usage unique) et on envoie
 *    le lien par e-mail via Brevo ;
 * 3. le lien ouvre /admin/auth?token=… qui pose un cookie de session signé (30 jours).
 */

const TOKEN_MINUTES = 15;
const hash = (t: string) => createHash("sha256").update(t).digest("hex");

export async function currentAdmin() {
  return verifySession(cookies().get(SESSION_COOKIE)?.value);
}

/** À appeler en tête de chaque action / page admin. */
export async function requireAdmin() {
  const email = await currentAdmin();
  if (!email) redirect("/admin/login");
  return email;
}

export type LoginRequestResult = { ok: true; devLink?: string } | { ok: false; error: string };

export async function requestLoginLink(rawEmail: string, origin: string): Promise<LoginRequestResult> {
  const email = rawEmail.trim().toLowerCase();
  // Réponse identique que l'adresse soit autorisée ou non (on ne révèle pas la liste).
  if (!adminEmails().includes(email)) return { ok: true };

  const sql = await getSql();
  if (!sql) return { ok: false, error: "La base de données n'est pas encore configurée." };

  const token = randomBytes(32).toString("hex");
  await sql`delete from admin_login_tokens where expires_at < now() - interval '1 day'`;
  await sql`
    insert into admin_login_tokens (token_hash, email, expires_at)
    values (${hash(token)}, ${email}, now() + make_interval(mins => ${TOKEN_MINUTES}))`;

  const link = `${origin}/admin/auth?token=${token}`;
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[admin] lien de connexion (dev, pas de BREVO_API_KEY) : ${link}`);
      return { ok: true, devLink: link };
    }
    return { ok: false, error: "L'envoi d'e-mails n'est pas configuré (clé Brevo manquante)." };
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify({
      sender: { name: site.name, email: site.email },
      to: [{ email }],
      subject: "Votre lien de connexion — espace admin La Casa de Anna",
      htmlContent: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0c0a08;line-height:1.6">
        <p>Bonjour,</p>
        <p>Voici votre lien pour accéder à l'espace admin du site La Casa de Anna :</p>
        <p><a href="${link}" style="display:inline-block;background:#7d724b;color:#fff;padding:12px 22px;text-decoration:none">Me connecter</a></p>
        <p style="color:#6e675c;font-size:13px">Ce lien est valable ${TOKEN_MINUTES} minutes et ne peut servir qu'une fois.
        Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail.</p>
      </div>`,
    }),
  });
  if (!res.ok) {
    console.error("[admin] envoi Brevo échoué", res.status, await res.text());
    return { ok: false, error: "L'e-mail n'a pas pu être envoyé. Réessayez dans un instant." };
  }
  return { ok: true };
}

/** Vérifie un jeton de lien magique (usage unique) et ouvre la session. */
export async function consumeLoginToken(token: string): Promise<boolean> {
  const sql = await getSql();
  if (!sql || !/^[a-f0-9]{64}$/.test(token)) return false;
  const rows = (await sql`
    update admin_login_tokens set used_at = now()
    where token_hash = ${hash(token)} and used_at is null and expires_at > now()
    returning email`) as { email: string }[];
  const email = rows[0]?.email;
  if (!email || !adminEmails().includes(email)) return false;
  cookies().set(SESSION_COOKIE, await signSession(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
  return true;
}

export function logout() {
  cookies().delete(SESSION_COOKIE);
}
