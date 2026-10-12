"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Img } from "@/lib/content";

const MAX_SIDE = 2400; // largeur/hauteur max après redimensionnement
const MAX_BYTES = 4 * 1024 * 1024; // limite d'envoi vers le serveur

/**
 * Redimensionne la photo dans le navigateur (2400 px max, JPEG optimisé) avant l'envoi :
 * une photo d'iPhone de 6 Mo passe sous 1 Mo, le site reste rapide.
 */
async function prepare(file: File): Promise<{ blob: Blob; width: number; height: number; name: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let blob: Blob | null = null;
  for (const quality of [0.86, 0.78, 0.68, 0.58]) {
    blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (blob && blob.size <= MAX_BYTES) break;
  }
  if (!blob || blob.size > MAX_BYTES) throw new Error("Photo trop lourde même après compression");
  return { blob, width, height, name: file.name.replace(/\.[^.]+$/, "") + ".jpg" };
}

async function uploadFiles(files: File[], folder: string, onProgress: (done: number) => void): Promise<Img[]> {
  const out: Img[] = [];
  for (const [i, file] of files.entries()) {
    const { blob, width, height, name } = await prepare(file);
    const body = new FormData();
    body.append("file", new File([blob], name, { type: "image/jpeg" }));
    body.append("folder", folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `Erreur ${res.status}`);
    const { url } = (await res.json()) as { url: string };
    out.push({ src: url, width, height });
    onProgress(i + 1);
  }
  return out;
}

function DropZone({
  multiple,
  folder,
  onAdd,
}: {
  multiple: boolean;
  folder: string;
  onAdd: (imgs: Img[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handle = async (list: FileList | null) => {
    const files = Array.from(list ?? []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    setError(null);
    setBusy({ done: 0, total: files.length });
    try {
      onAdd(await uploadFiles(multiple ? files : files.slice(0, 1), folder, (done) => setBusy({ done, total: files.length })));
    } catch (err) {
      console.error(err);
      setError("L'envoi des photos a échoué. Formats acceptés : JPG, PNG, WebP (25 Mo max par photo).");
    } finally {
      setBusy(null);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          handle(e.dataTransfer.files);
        }}
        disabled={Boolean(busy)}
        className={`admin-drop ${over ? "is-over" : ""}`}
      >
        {busy
          ? `Envoi en cours… ${busy.done} / ${busy.total}`
          : multiple
            ? "Glissez vos photos ici, ou cliquez pour les choisir"
            : "Glissez une photo ici, ou cliquez pour la choisir"}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple={multiple}
        hidden
        onChange={(e) => handle(e.target.files)}
      />
      {error && <p className="admin-alert mt-3">{error}</p>}
    </div>
  );
}

/** Galerie ordonnée : la 1re photo est la couverture. */
export function ImagesField({
  value,
  onChange,
  folder,
}: {
  value: Img[];
  onChange: (v: Img[]) => void;
  folder: string;
}) {
  const move = (i: number, j: number) => {
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    const [x] = next.splice(i, 1);
    next.splice(j, 0, x);
    onChange(next);
  };

  return (
    <div>
      <DropZone multiple folder={folder} onAdd={(imgs) => onChange([...value, ...imgs])} />
      {value.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((img, i) => (
            <li key={img.src} className="bg-white p-2 shadow-sm">
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Image src={img.src} alt="" fill sizes="240px" className="object-cover" />
                {i === 0 && <span className="admin-badge absolute left-2 top-2">Couverture</span>}
              </div>
              <div className="mt-2 flex items-center justify-between gap-1 text-sm">
                <span className="flex gap-1">
                  <button type="button" className="admin-icon-btn" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Avancer">
                    ◀
                  </button>
                  <button type="button" className="admin-icon-btn" onClick={() => move(i, i + 1)} disabled={i === value.length - 1} aria-label="Reculer">
                    ▶
                  </button>
                </span>
                {i !== 0 && (
                  <button type="button" className="text-xs text-terre hover:underline" onClick={() => move(i, 0)}>
                    Couverture
                  </button>
                )}
                <button
                  type="button"
                  className="admin-icon-btn text-lin hover:text-red-700"
                  onClick={() => onChange(value.filter((_, k) => k !== i))}
                  aria-label="Retirer la photo"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Une seule photo (couverture d'article, visuel de prestation). */
export function ImageField({
  value,
  onChange,
  folder,
}: {
  value: Img | null;
  onChange: (v: Img | null) => void;
  folder: string;
}) {
  return (
    <div>
      {value && (
        <div className="relative mb-3 aspect-[4/3] max-w-sm overflow-hidden bg-sand">
          <Image src={value.src} alt="" fill sizes="384px" className="object-cover" />
          <button type="button" onClick={() => onChange(null)} className="admin-chip absolute right-2 top-2 bg-white">
            Retirer
          </button>
        </div>
      )}
      <DropZone multiple={false} folder={folder} onAdd={(imgs) => onChange(imgs[0] ?? null)} />
    </div>
  );
}
