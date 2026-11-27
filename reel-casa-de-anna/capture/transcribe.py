"""Transcription Whisper (faster-whisper, modèle large-v3, français) avec horodatage au mot.
Écrit audio/transcription.json : [{start, end, word}] + texte par segment."""
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
src = sys.argv[1] if len(sys.argv) > 1 else "audio/voix-natalia-16lufs.wav"
model = WhisperModel(sys.argv[2] if len(sys.argv) > 2 else "large-v3", device="cpu", compute_type="int8")
# amorce : orthographe des noms propres du reel
prompt = "La Casa de Anna, Bluffy, Veyrier-du-Lac, Madrid, la Corse, l'Alpe d'Huez, Jávea, Michaël, MasterPrompt, clé-en-main, IA."
# décodage via ffmpeg (16 kHz mono) : évite l'incompatibilité PyAV / faster-whisper
pcm = subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-i", src, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.float32)
segs, info = model.transcribe(audio, language="fr", word_timestamps=True, vad_filter=False, beam_size=5, initial_prompt=prompt)
out = {"language": info.language, "duration": info.duration, "segments": []}
for s in segs:
    out["segments"].append({"start": s.start, "end": s.end, "text": s.text.strip(), "words": [{"w": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3), "p": round(w.probability, 3)} for w in s.words]})
    print(f"{s.start:6.2f}–{s.end:6.2f}  {s.text.strip()}")
json.dump(out, open("audio/transcription.json", "w"), ensure_ascii=False, indent=1)
