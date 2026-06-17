import { NextResponse } from "next/server";
import { site } from "@/content/site";

/**
 * Réception du formulaire de contact (overlay CTA + page contact).
 * - Avec BREVO_API_KEY : crée/met à jour le contact + notifie le studio (transactionnel).
 * - Sans clé (dev/preview) : log serveur + réponse OK, pour que le parcours reste testable.
 */

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  message?: string;
};

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const name = data.name?.trim();
  const email = data.email?.trim();
  if (!name || !email) {
    return NextResponse.json({ error: "Nom et e-mail requis" }, { status: 422 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  if (!apiKey) {
    // Pas de clé : on ne perd pas le lead en dev, on le trace.
    console.info("[contact] (no BREVO_API_KEY) lead reçu:", data);
    return NextResponse.json({ ok: true, mode: "dev" });
  }

  try {
    // 1) Contact Brevo
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": apiKey },
      body: JSON.stringify({
        email,
        attributes: {
          NOM: name,
          SMS: data.phone ?? "",
          PROJET: data.projectType ?? "",
          MESSAGE: data.message ?? "",
        },
        listIds: listId ? [Number(listId)] : undefined,
        updateEnabled: true,
      }),
    });

    // 2) Notification au studio
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": apiKey },
      body: JSON.stringify({
        sender: { name: "Site La Casa de Anna", email: site.email },
        to: [{ email: site.email, name: site.name }],
        replyTo: { email, name },
        subject: `Nouveau contact — ${name}`,
        htmlContent: `<h2>Nouveau contact</h2>
          <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
          <p><strong>E-mail :</strong> ${escapeHtml(email)}</p>
          <p><strong>Téléphone :</strong> ${escapeHtml(data.phone ?? "—")}</p>
          <p><strong>Type :</strong> ${escapeHtml(data.projectType ?? "—")}</p>
          <p><strong>Message :</strong><br/>${escapeHtml(data.message ?? "—")}</p>`,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] erreur Brevo:", error);
    return NextResponse.json({ error: "Envoi impossible" }, { status: 502 });
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
