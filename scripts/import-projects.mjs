/**
 * Ajoute (ou remplace) des catégories de photos projet dans le manifest d'images.
 * Mêmes conventions que le manifest existant : webp, variantes full / lg / md / thumb,
 * fichiers dans /public/assets/img/<category>/<id>-<variant>.webp.
 *
 * Sources :
 *  - Notion : export local (NOTION_BASE)
 *  - Wix    : ancien site lacasadeanna.com (static.wixstatic.com)
 *
 * Usage : node scripts/import-projects.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NOTION =
  process.env.NOTION_BASE ??
  "C:\\Users\\ppmpc\\Desktop\\MasterPrompt\\analyse\\la casa de anna\\base notion";
const MANIFEST = path.join(ROOT, "public/assets/img/manifest.json");

/** Largeurs max par variante (alignées sur le manifest existant). */
const VARIANTS = [
  ["full", 2000, 82],
  ["lg", 1200, 80],
  ["md", 900, 78],
  ["thumb", 480, 74],
];

/** Première image = couverture du projet. */
const IMPORTS = [
  {
    category: "projects/alpe-d-huez",
    kind: "notion",
    files: [
      "1c77add0-0322-4af0-9ff8-7ad5f323fc2e.png",
      "46e72fd7-838a-4791-8808-e22220bede91.png",
      "d8924bf0-d3f7-4943-a295-3b2db726d708.png",
      "9759c4e0-a65a-45a5-b505-fb8260c86097.png",
      "cde4bdfb-af3e-4aac-a626-1bc07e1fb725.png",
      "6a698c23-d7bc-4a0e-83e5-e7d61ac16105.png",
      "43b71cd5-3464-4cda-aa94-20cef6f47673.png",
      "2bf99a78-a25a-4cc2-a97c-47d38934eeda.png",
      "785da96e-b5e7-4fd2-be0a-eb901c1a214c.png",
      "5e595302-a224-4122-9c63-ae22fe022d72.png",
      "64d843e2-5960-4c09-a176-4551de332ba3.png",
      "1fd95fdb-e5ca-4eb3-b52a-08b5bb58dce1.png",
      "0e5a5df1-13a2-411a-a4d5-7fce5b654850.png",
      "530e8716-a989-457e-9445-b87df1e74f2d.png",
      "6b674e8f-d987-466f-92f9-6d78a23c0069.png",
      "fd592e4b-393e-46da-b269-e9c7cf71d3a4.png",
    ],
  },
  {
    category: "projects/comme-a-l-hotel",
    kind: "wix",
    files: [
      "ce961c_6822c8c238434d72b61c76600e4e13e0~mv2.jpg",
      "ce961c_2e7800b583d34d0b83c8fa2c025e23da~mv2.jpg",
      "ce961c_5a5589fc58234b4bb60e2d095a4e9b43~mv2.jpg",
      "ce961c_3a9574d09b8747e2bcebb8c38c6e9df5~mv2.jpg",
      "ce961c_7202f6a47f4b4b849ecbb5d4ea017d09~mv2.jpg",
      "ce961c_90c08d08e656430e8e32cbd1393be594~mv2.jpg",
      "ce961c_c3299fa93ead4819bd19d8ad705d82b7~mv2.jpg",
      "ce961c_8a8ab18029754a11aab1f4ac6078e257~mv2.jpg",
    ],
  },
  {
    category: "projects/menthon-saint-bernard",
    kind: "wix",
    files: [
      "ce961c_0071fe49f1cc4763978ce8b6eb4b9402~mv2.jpg",
      "ce961c_8b6d0f9709e04f8cbcdea0edd56fc285~mv2.jpg",
      "ce961c_8b586ef30656406a9e474d1e0061f9ca~mv2.jpg",
      "ce961c_adfd377f018c45209369e4f926b9701d~mv2.jpg",
      "ce961c_296bbc1d626f4ec0a72cb0df58a09008~mv2.jpg",
      "ce961c_160b0d70522a4cb18936af617095e991~mv2.jpg",
      "ce961c_f3986ea3ee8740138becb14a7137afc4~mv2.jpg",
      "ce961c_3712dfde3d1849ee9ffa31fef06c71ac~mv2.jpg",
      "ce961c_1016054b8d4640b18cc40a5a9bc911a5~mv2.jpg",
      "ce961c_b6cd44f391db40818e8df9a0980d900c~mv2.jpg",
    ],
  },
];

const slugify = (s) =>
  s
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/~mv2$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function load(kind, file) {
  if (kind === "notion") return fs.readFileSync(path.join(NOTION, file));
  const url = `https://static.wixstatic.com/media/${file}/v1/fit/w_2400,h_2400,q_90/f.jpg`;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url);
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (attempt === 3) throw new Error(`${res.status} ${url}`);
  }
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));

for (const { category, kind, files } of IMPORTS) {
  const dir = path.join(ROOT, "public/assets/img", category);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  manifest.images = manifest.images.filter((img) => img.category !== category);

  for (const [i, file] of files.entries()) {
    const base = `${String(i + 1).padStart(2, "0")}-${slugify(file).slice(0, 24)}`;
    const buf = await sharp(await load(kind, file)).rotate().toBuffer();
    const meta = await sharp(buf).metadata();
    const outputs = [];
    for (const [name, maxW, quality] of VARIANTS) {
      const out = await sharp(buf)
        .resize({ width: maxW, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer({ resolveWithObject: true });
      const rel = `/assets/img/${category}/${base}-${name}.webp`;
      fs.writeFileSync(path.join(ROOT, "public", rel), out.data);
      outputs.push({ variant: name, path: rel, width: out.info.width, height: out.info.height, bytes: out.info.size });
    }
    manifest.images.push({
      id: `${category}/${base}`,
      category,
      source: `${kind}:${file}`,
      original: { width: meta.width, height: meta.height, bytes: buf.length },
      outputs,
    });
  }
  console.log(`${category} : ${files.length} photos`);
}

manifest.generatedAt = new Date().toISOString();
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
