import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Accès aux images déjà optimisées (webp multi-tailles) décrites par
 * /public/assets/img/manifest.json. Lecture serveur, mise en cache mémoire.
 *
 * Variantes disponibles : "thumb" | "md" | "lg" | "full".
 */

export type ImageVariant = "thumb" | "md" | "lg" | "full";

export type OptimizedOutput = {
  variant: string;
  path: string;
  width?: number;
  height?: number;
  bytes?: number;
};

export type OptimizedImage = {
  id: string;
  category: string;
  source?: string;
  original?: { width: number; height: number; bytes: number };
  outputs: OptimizedOutput[];
};

export type ImageManifest = {
  generatedAt: string;
  images: OptimizedImage[];
};

let cache: ImageManifest | null = null;

export async function getManifest(): Promise<ImageManifest> {
  if (cache) return cache;
  try {
    const file = path.join(
      process.cwd(),
      "public",
      "assets",
      "img",
      "manifest.json",
    );
    cache = JSON.parse(await readFile(file, "utf-8")) as ImageManifest;
  } catch {
    cache = { generatedAt: "", images: [] };
  }
  return cache;
}

export function variant(
  image: OptimizedImage | undefined,
  preferred: ImageVariant = "lg",
): OptimizedOutput | undefined {
  if (!image) return undefined;
  return (
    image.outputs.find((o) => o.variant === preferred) ?? image.outputs.at(-1)
  );
}

/** Toutes les images d'une catégorie (ex. "team", "projects/home-veyrier-du-lac"). */
export async function imagesByCategory(
  category: string,
): Promise<OptimizedImage[]> {
  const manifest = await getManifest();
  return manifest.images.filter((img) => img.category === category);
}

/** Une image résolue { src, width, height } prête pour next/image. */
export async function resolveImage(
  category: string,
  opts: { index?: number; variant?: ImageVariant } = {},
): Promise<{ src: string; width: number; height: number } | null> {
  const images = await imagesByCategory(category);
  const image = images[opts.index ?? 0];
  const out = variant(image, opts.variant);
  if (!out) return null;
  return {
    src: out.path,
    width: out.width ?? 1200,
    height: out.height ?? 1500,
  };
}
