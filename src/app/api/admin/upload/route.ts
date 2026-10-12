import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/auth";

/**
 * Réception d'une photo depuis l'admin (déjà redimensionnée dans le navigateur, < 4 Mo)
 * et enregistrement dans Vercel Blob (store public, authentification OIDC du projet).
 */
const MAX_BYTES = 4 * 1024 * 1024; // limite de corps des fonctions Vercel : 4,5 Mo
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  if (!(await currentAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "divers")
    .toLowerCase()
    .replace(/[^a-z0-9/-]+/g, "-")
    .replace(/\/{2,}/g, "/")
    .slice(0, 80);

  if (!(file instanceof File)) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  if (!TYPES.includes(file.type)) return NextResponse.json({ error: "Format non accepté" }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Photo trop lourde" }, { status: 413 });

  const name = file.name.normalize("NFD").replace(/[^\w.-]+/g, "-").toLowerCase().slice(-60) || "photo.jpg";
  try {
    const blob = await put(`${folder}/${name}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("[admin] upload Blob", err);
    return NextResponse.json({ error: "Stockage indisponible" }, { status: 502 });
  }
}
