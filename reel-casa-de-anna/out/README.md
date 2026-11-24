# Reel « Notre nouveau site est en ligne » : La Casa de Anna

Rendu en **mode B** (pas de voix fournie) : timing de référence du brief, sous-titres affichés comme guide.

| Fichier | Contenu |
|---|---|
| `reel-casa-de-anna.mp4` | 1080×1920, 30 fps, H.264 yuv420p CRF 18, 38,0 s, 11,5 Mo, sous-titres-guide incrustés, sans audio |
| `reel-muet.mp4` | même chose sans sous-titres (pour enregistrer la voix dans l'éditeur Instagram), 10,8 Mo |
| `cover.jpg` | 1080×1920 ; titre et photo tiennent dans la zone grille 4:5 (y 285 → 1635) |
| `sous-titres.srt` | 13 blocs, 2 lignes max |
| `brand.json` | polices, couleurs, logos relevés |

## Site source
- Le site en ligne correspond au dépôt **lacasadeannav4** (Next.js / Vercel). `lacasadeanna` (HTML statique) et `lacasadeannav2` sont d'anciennes versions.
- Captures : Playwright sur https://lacasadeanna.com, viewport iPhone 14 Pro 393×852 @3x, page entièrement défilée avant capture. Pas de bandeau cookies rencontré.
- La pastille fixe « Menu / Démarrer un projet » est masquée dans les pleines pages, capturée à part, puis reposée en position fixe dans la maquette.

## Polices et couleurs retenues
- Titres : **Josefin Sans** 600 (300 italique pour les numéros). Corps et sous-titres : **Inter**. Ce sont les polices réelles du site (Google Fonts auto-hébergées), donc aucune substitution.
- Couleurs : fond #ffffff, sable #e6e0d3, encre #0c0a08, accent des titres #7d724b, bouton CTA #5c3a1e, texte secondaire #94897a, texte sur photo #efebe3.
- **Écart constaté** : le code contient deux palettes. Les variables CSS donnent sable #f4f1ea, terre #7d724b, lin #6e675c ; Tailwind compile sable #e6e0d3, terre #5c3a1e, lin #94897a. Le site affiche un mélange des deux (accent olive sur les titres, CTA brun). J'ai reproduit ce que le site affiche réellement.

## Images
- Photos récupérées sur le site en ligne, dans la plus grande version servie (`*-full.webp`) : couvertures madrid, corse, alpe-d-huez, javea (+ les autres réalisations), galerie du chalet (56 photos), showroom (dining, detail, night, hero).
- Utilisées : S1 et cover = couverture chalet-vue-lac ; S3 = chalet (salon vue lac), Madrid, Corse, Alpe d'Huez, Jávea ; S6 = showroom repas, détail, nuit (en dernier).
- Pas de couverture Art & Décoration, pas de rubrique Journal.

## Écarts par rapport au brief (à lire)
1. **Prix** : la page Prestations affiche **890 €** pour la consultation, la meta description dit **790 €**. À corriger sur le site. Le prix est masqué (rectangle blanc) dans la capture et aucun prix n'apparaît à l'écran.
2. **Pas de vrai plein cadre** en S1, S3 et S6 : les originaux font 1 000 à 1 600 px de haut (couverture du chalet : 1 206×1 197 px, déjà compressée). En plein cadre 1080×1920, l'image serait agrandie de 1,6× et visiblement floue (testé). J'ai donc utilisé des cadres éditoriaux : bandeau 4:5 en S1, cadres sur fond blanc en S3/S6. Agrandissement maximal environ 1,2× (S1, Corse). Les captures du site, elles, ne sont jamais agrandies : réduction Lanczos à la taille d'affichage exacte.
3. **Visages** : la photo hero du site montre Natalia (petite, en bas à droite, S2 vers 3–6 s). La photo « Consultation » de la page Prestations montre Natalia et Coline (bas de l'écran du téléphone, S5 entre 22 et 24,5 s). C'est le contenu réel du site. Si « aucun visage » est strict, il faut recadrer ces deux plans.
4. **MasterPrompt** : la phrase 7 de la voix dit « Merci à Michaël et MasterPrompt ». Les sous-titres incrustés le reprennent donc aussi, en plus de la ligne de crédit. Cette règle du brief contredit le texte de la voix. Pour garder une seule mention, il faut couper ce bloc de sous-titre.
5. **Visuels Corse et Jávea** : d'après leurs noms de fichiers (« rendu ultra réaliste », « image chatgpt »), ce sont des rendus et non des photos. Jávea est bien annoncée « en cours ». Corse est présentée comme une réalisation.
6. Le timing de référence donne des débits inégaux (S1 : 8 mots en 2,7 s ; S6 : 7 mots en 4,7 s). Il sera recalé sur la vraie voix en mode A.

## Contrôles effectués
- Images-clés extraites du MP4 (`controles/`) : textes et sous-titres dans les zones sûres (haut 250, bas 420, côtés 80 px). Seuls le bas du téléphone et le défilé des marques débordent, et ce sont des éléments décoratifs.
- Durée 38,0 s, 1 140 images, fichiers < 12 Mo.
- « MasterPrompt » : seulement dans la ligne de crédit S7 (36,5 → 38 s), plus le sous-titre de la phrase 7 (voir écart 4).

## Mode A (quand la voix arrive)
Pas encore implémenté (aucun audio pour le tester). À faire : transcription Whisper au mot, réécriture de `timings.json` (même format), puis relance de `render/render.cjs` + ffmpeg avec la voix normalisée à -16 LUFS. Les photos de S3 se calent déjà automatiquement sur les mots prononcés (chalet, Madrid, Corse, Alpe, Jávea).

## Refaire le rendu
```
node capture/brand.cjs && node capture/pages.cjs && node capture/photos.cjs && node capture/price-bbox.cjs
python3 capture/prepare.py && python3 build_timings.py
node render/render.cjs subs 3 && node render/render.cjs muet 3 && node render/cover.cjs
ffmpeg -framerate 30 -i render/frames-subs/f%05d.png -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -movflags +faststart out/reel-casa-de-anna.mp4
```
Aperçu d'un instant : ouvrir `scenes/reel.html?t=12.5` (ou `&subs=0`).

## Changements v2

Fichiers : `reel-casa-de-anna-v2.mp4` (50,0 s, 13,3 Mo), `reel-muet-v2.mp4` (12,2 Mo), `sous-titres-v2.srt`, `controles-v2/`.
La v1 est intacte (`reel.html`, `timings.json`, fichiers sans suffixe). Sources v2 : `scenes/reel-v2.html`, `build_timings_v2.py` → `timings-v2.json`. Couverture inchangée.

- **Scènes 1 à 5** : inchangées (code identique à la v1).
- **S6 (28–33 s)** : photos et défilé des marques conservés. Dans la dernière seconde, fondu vers le logo La Casa de Anna, « lacasadeanna.com » et « Lien en bio ». L'ancien écran de fin et la ligne de crédit sont supprimés.
- **S7 (33–43 s)** : le fond passe du beige au crème #F0EDE8 en 0,6 s. L'iPhone (accueil La Casa de Anna) est à gauche, relié au logo MasterPrompt par un trait or tracé de gauche à droite, avec le texte « Site conçu avec MasterPrompt ». L'iPhone glisse ensuite au centre, l'écran passe à la page formation, qui défile, avec le texte « L'IA pour les indépendants ».
- **S8 (43–50 s)** : fond navy, logo, « Formation IA gratuite », « pour indépendants, zéro jargon », bouton or « Commentez IA » avec une bulle (2 pulsations sans rebond), ligne DM Mono. Image totalement immobile pendant les **3,6 dernières secondes** (mesuré image par image).
- **Sous-titres S7–S8** : même style, fond navy semi-transparent, mot actif en or. Sur S1–S6, aucun élément MasterPrompt (vérifié).

### Écarts v2 (à lire)
1. **Durée de S7 et S8** : le brief prévoit 6 s chacune, mais la phrase 7 fait ~30 mots, soit 5 mots/s (illisible en sous-titres, intenable à l'oral). S7 dure donc 10 s et S8 7 s. Total **50 s**, à la limite haute de la fourchette 40–50 s. Pour revenir à ~45 s, il faut raccourcir la phrase 7.
2. **Logo** : le fichier du brief (`C:\Users\ppmpc\…\logo.png`) est sur ton PC et inaccessible d'ici. J'ai pris `https://www.masterprompt.fr/logo.png` (633×167). Son texte est blanc : pour le fond crème de S7, j'ai généré `assets/masterprompt-logo-navy.png` (blanc → navy, or conservé). Remplace-le par l'original si besoin.
3. **URL formation** : `masterprompt.fr/casa` renvoie une 404. J'ai capturé `https://www.masterprompt.fr/formation` (titre : « Formation IA gratuite »). Pour en changer : `URL_FORMATION=… node capture/formation.cjs`.
4. **Or sur crème** : #F59E0B sur #F0EDE8 = 1,84:1, illisible. En S7, le texte en couleur est en or foncé #b46f04 (3,45:1, suffisant pour du grand texte gras). Le bouton or + navy en S8 donne **8,1:1** (≥ 4,5 ✔).
5. **Visage** : la page formation montre la miniature vidéo de Michaël (fin de S7).
6. **Mode A (Whisper)** : toujours pas implémenté, faute d'audio pour le tester. Les timings v2 ont le même format, prêts à être remplacés par l'alignement.
