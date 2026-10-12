import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Accès Neon (Postgres serverless). Une seule table générique `content_items`
 * stocke tous les contenus éditables (chantiers, journal, FAQ, avis, prestations)
 * sous forme JSON, + `admin_login_tokens` pour les liens de connexion.
 *
 * Les tables sont créées à la volée au premier accès : aucune migration manuelle.
 * Sans DATABASE_URL (dev, aperçu non configuré), `getSql()` renvoie null et le
 * site retombe sur le contenu statique de src/content.
 */

let client: NeonQueryFunction<false, false> | null = null;
let schemaReady: Promise<void> | null = null;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export async function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  client ??= neon(url);
  schemaReady ??= ensureSchema(client).catch((err) => {
    schemaReady = null; // on retentera au prochain appel
    throw err;
  });
  await schemaReady;
  return client;
}

async function ensureSchema(sql: NeonQueryFunction<false, false>) {
  await sql`
    create table if not exists content_items (
      kind text not null,
      id text not null,
      position integer not null default 0,
      published boolean not null default true,
      data jsonb not null,
      updated_at timestamptz not null default now(),
      updated_by text,
      primary key (kind, id)
    )`;
  await sql`
    create table if not exists admin_login_attempts (
      email text not null,
      at timestamptz not null default now()
    )`;
  await sql`
    create table if not exists admin_login_tokens (
      token_hash text primary key,
      email text not null,
      expires_at timestamptz not null,
      used_at timestamptz
    )`;
}
