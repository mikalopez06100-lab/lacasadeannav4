"""v2-final : timeline v2 inchangée (scènes et repères visuels), sous-titres tirés de la
transcription Whisper de la voix réelle (audio/transcription.json), audio posé à 0 s.
Écrit timings-v2-final.json, scenes/timings-v2-final.js et out/sous-titres-v2-final.srt."""
import json, math, re
v2 = json.load(open("timings-v2.json"))
tr = json.load(open("audio/transcription.json"))
FPS = v2["fps"]
# Whisper découpe les élisions et les traits d'union (« l » + « 'Alpe ») : on recolle
raw = [dict(w) for s in tr["segments"] for w in s["words"] if w["w"]]
words = []
for w in raw:
    if words and re.match(r"^['’-]", w["w"]):
        words[-1]["w"] += w["w"]; words[-1]["end"] = w["end"]
    else:
        words.append(w)
# corrections d'orthographe seulement (homophones), jamais de mots ajoutés ou retirés
FIX = {("aux", "clés-en-main"): ("au", "clé-en-main")}
for i in range(len(words) - 1):
    k = (words[i]["w"], re.sub(r"[.,]$", "", words[i + 1]["w"]))
    if k in FIX:
        a, b = FIX[k]; words[i]["w"] = a; words[i + 1]["w"] = b + words[i + 1]["w"][len(k[1]):]
for i, w in enumerate(words):  # fin de mot = début du suivant au plus tôt (pas de chevauchement)
    if i + 1 < len(words): w["end"] = min(w["end"], words[i + 1]["start"])

# blocs : une phrase par bloc ; une phrase trop longue (> 2 lignes) est coupée en deux
# parts équilibrées, de préférence après la virgule la plus proche du milieu
MAXC = 62
# coupures choisies à la main quand l'équilibre automatique coupe une énumération
PREFER = {"ressemble,"}
def text(ws): return " ".join(w["w"] for w in ws)
def split(ws):
    if len(text(ws)) <= MAXC: return [ws]
    total = len(text(ws)); best = None
    for j in range(1, len(ws)):
        l, r = len(text(ws[:j])), len(text(ws[j:]))
        if min(l, r) < 14: continue
        score = abs(l - r) - (12 if ws[j - 1]["w"].endswith(",") else 0)
        if ws[j - 1]["w"] in PREFER: score -= 100
        if best is None or score < best[0]: best = (score, j)
    j = best[1]
    return split(ws[:j]) + split(ws[j:])
sentences, cur = [], []
for w in words:
    cur.append(w)
    if re.search(r"[.!…]$", w["w"]) or (w["w"].endswith("?") and False):
        sentences.append(cur); cur = []
if cur: sentences.append(cur)
chunks = [c for s_ in sentences for c in split(s_)]
# fusionne deux blocs courts et rapprochés (« Votre projet commence ici. » + « Lien en bio. »)
merged = []
for c in chunks:
    if merged and len(text(merged[-1])) < 30 and len(text(merged[-1] + c)) <= MAXC and c[0]["start"] - merged[-1][-1]["end"] < 0.6:
        merged[-1] = merged[-1] + c
    else:
        merged.append(c)
S7 = next(s for s in v2["scenes"] if s["id"] == "S7")["start"]
out_chunks = []
for i, c in enumerate(merged):
    start = c[0]["start"]
    end = min(c[-1]["end"] + 0.5, merged[i + 1][0]["start"] - 0.05) if i + 1 < len(merged) else c[-1]["end"] + 0.8
    out_chunks.append({"text": text(c), "start": round(start, 3), "end": round(end, 3),
                       "mp": start >= S7 - 0.5,  # style navy/or dès la phrase sur MasterPrompt
                       "words": [{"w": w["w"], "start": w["start"], "end": w["end"]} for w in c]})
audio_d = tr["duration"]
duration = max(v2["duration"], math.ceil(audio_d * FPS) / FPS)
out = {**{k: v2[k] for k in ("fps", "width", "height")}, "mode": "A (audio réel, timeline v2 non recalée)", "version": "2-final",
       "audio": {"file": "audio/voix-natalia-16lufs.wav", "offset": 0, "duration": audio_d},
       "duration": duration, "scenes": v2["scenes"],
       "guide": v2["sentences"],  # repères visuels v2 (photos S3) conservés tels quels
       "sentences": [{"id": i + 1, "start": c["start"], "end": c["end"], "text": c["text"], "chunks": [c]} for i, c in enumerate(out_chunks)]}
json.dump(out, open("timings-v2-final.json", "w"), ensure_ascii=False, indent=1)
open("scenes/timings-v2-final.js", "w").write("window.TIMINGS = " + json.dumps(out, ensure_ascii=False) + ";\n")
def ts(x):
    ms = round(x * 1000); return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"
open("out/sous-titres-v2-final.srt", "w").write("\n".join(f"{i+1}\n{ts(c['start'])} --> {ts(c['end'])}\n{c['text']}\n" for i, c in enumerate(out_chunks)))
for c in out_chunks: print(f"{c['start']:6.2f}–{c['end']:6.2f} {'MP ' if c['mp'] else '   '}{len(c['text']):3d}  {c['text']}")
print("durée vidéo", duration, "s /", round(duration * FPS), "images ; audio", audio_d)
