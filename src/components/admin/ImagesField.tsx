"use client";

import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { useRef, useState } from "react";
import type { Img } from "@/lib/content";

/** Dimensions réelles d'un fichier image, lues dans le navigateur. */
function readSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const el = new window.Image();
    el.onload = () => {
      resolve({ width: el.naturalWidth, height: el.naturalHeight });
      URL.revokeObjectURL(url);
    };
    el.onerror = () => resolve({ width: 1600, height: 1200 });
    el.src = url;
  });
}

async function uploadFiles(files: File[], folder: string, onProgress: (done: number) => void): Promise<Img[]> {
  const out: Img[] = [];
  for (const [i, file] of files.entries()) {
    const size = await readSize(file);
    const safe = file.name.normalize("NFD").replace(/[^\w.-]+/g, "-").toLowerCase();
    const blob = await upload(`${folder}/${safe}`, file, {
      access: "public",
      handleUploadUrl: "/api/admin/upload",
    });
    out.push({ src: blob.url, ...size });
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
        accept="image/jpeg,image/png,image/webp,image/avif"
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
