"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

/**
 * Formulaire de contact court de l'overlay CTA.
 * POST → /api/contact (push Brevo côté serveur). Champs : nom, téléphone, projet, type.
 */
export function ContactForm({ onSuccess }: { onSuccess?: () => void }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setTimeout(() => onSuccess?.(), 1400);
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <p className="font-display text-3xl italic">
        Merci — nous vous recontactons très vite.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <p className="display-h2 mb-2 text-cream">Démarrons.</p>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="label text-lin">Nom</span>
          <input
            name="name"
            required
            autoComplete="name"
            className="border-b border-lin/40 bg-transparent py-2 text-cream outline-none focus:border-cream"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="label text-lin">E-mail</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="border-b border-lin/40 bg-transparent py-2 text-cream outline-none focus:border-cream"
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="label text-lin">Téléphone</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className="border-b border-lin/40 bg-transparent py-2 text-cream outline-none focus:border-cream"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="label text-lin">Type de projet</span>
          <select
            name="projectType"
            className="border-b border-lin/40 bg-transparent py-2 text-cream outline-none focus:border-cream"
          >
            <option className="text-ink">Résidentiel</option>
            <option className="text-ink">Professionnel</option>
            <option className="text-ink">Mobilier sur mesure</option>
            <option className="text-ink">Rideaux / banquettes</option>
            <option className="text-ink">Autre</option>
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="label text-lin">Votre projet en quelques mots</span>
        <textarea
          name="message"
          rows={3}
          className="resize-none border-b border-lin/40 bg-transparent py-2 text-cream outline-none focus:border-cream"
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="label mt-2 self-start bg-cream px-6 py-3 text-ink transition-colors duration-300 ease-soft hover:bg-terre hover:text-cream disabled:opacity-60"
      >
        {status === "sending" ? "Envoi…" : "Envoyer →"}
      </button>

      {status === "error" && (
        <p className="text-sm text-terre">
          Une erreur est survenue. Écrivez-nous à decoration@lacasadeanna.com.
        </p>
      )}
    </form>
  );
}
