"""v2 — Mode B (pas d'audio) : timing de référence du brief.
Écrit timings.json, scenes/timings.js (lu par reel.html) et out/sous-titres-v2.srt.
Les mots sont répartis dans la fenêtre de chaque phrase au prorata de leur longueur,
avec une pause après la ponctuation. En mode A, seules les fenêtres/mots changent :
les repères internes des scènes (cues) sont exprimés en fraction de la scène."""
import json, re
# S7/S8 allongées vs brief v2 (6 s chacune) : 30 mots en 6 s = 5 mots/s, illisible.
SCENES = [(0, 3), (3, 8), (8, 16), (16, 22), (22, 28), (28, 33), (33, 43), (43, 50)]
# phrases découpées en blocs de sous-titres (2 lignes max)
SENTENCES = [
    ["Ça y est, notre nouveau site est en ligne."],
    ["On voulait un site qui nous ressemble :", "calme, lumineux, et qui raconte vraiment nos projets."],
    ["Vous y retrouvez nos réalisations :", "le chalet face au lac, Madrid, la Corse, l'Alpe d'Huez…", "et la villa de Jávea, en cours."],
    ["Chaque projet, avec ses matières, ses détails,", "et les mots de nos clients."],
    ["Nos six façons de travailler ensemble,", "de la consultation au clé-en-main."],
    ["Et notre showroom à Bluffy.", "Votre projet commence ici : lien en bio."],
    ["Ce site, on l'a conçu avec Michaël, de MasterPrompt.", "Il aide les indépendants à utiliser l'IA pour gagner du temps,", "et franchement, on s'en sert maintenant tous les jours."],
    ["Vous êtes indépendant ? Sa formation IA est gratuite.", "Commentez IA, on vous envoie le lien."],
]
LEAD, TAIL = 0.2, 0.35  # la phrase démarre 0,2 s après la scène

def weight(w):
    p = 0
    if re.search(r"[,:]$", w): p = 3
    if re.search(r"[.…]$", w): p = 5
    return len(w) + 2, p

out = {"fps": 30, "width": 1080, "height": 1920, "mode": "B", "version": 2, "duration": SCENES[-1][1], "scenes": [], "sentences": []}
for i, (a, b) in enumerate(SCENES):
    out["scenes"].append({"id": f"S{i+1}", "start": a, "end": b})
    s0, s1 = a + LEAD, (b - TAIL if i < 7 else a + 4.9)
    words = []
    for ci, chunk in enumerate(SENTENCES[i]):
        for w in chunk.split(" "):
            words.append((ci, w))
    ws = [weight(w) for _, w in words]
    total = sum(x + p for x, p in ws) - ws[-1][1]
    k = (s1 - s0) / total
    t = s0; chunks = [{"text": c, "words": []} for c in SENTENCES[i]]
    for (ci, w), (x, p) in zip(words, ws):
        chunks[ci]["words"].append({"w": w, "start": round(t, 3), "end": round(t + x * k, 3)})
        t += (x + p) * k
    for ci, c in enumerate(chunks):
        c["start"] = c["words"][0]["start"]
        c["end"] = chunks[ci + 1]["words"][0]["start"] - 0.05 if ci + 1 < len(chunks) else round(s1 + 0.25, 3)
        c["end"] = round(c["end"], 3)
    out["sentences"].append({"id": i + 1, "scene": f"S{i+1}", "start": chunks[0]["start"], "end": chunks[-1]["end"], "text": " ".join(SENTENCES[i]), "chunks": chunks})

json.dump(out, open("timings-v2.json", "w"), ensure_ascii=False, indent=1)
open("scenes/timings-v2.js", "w").write("window.TIMINGS = " + json.dumps(out, ensure_ascii=False) + ";\n")
def ts(x):
    ms = round(x * 1000); return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"
n = 0; srt = []
for s in out["sentences"]:
    for c in s["chunks"]:
        n += 1; srt.append(f"{n}\n{ts(c['start'])} --> {ts(c['end'])}\n{c['text']}\n")
open("out/sous-titres-v2.srt", "w").write("\n".join(srt))
print(open("out/sous-titres-v2.srt").read())
