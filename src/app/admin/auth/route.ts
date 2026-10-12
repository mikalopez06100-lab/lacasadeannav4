import { NextResponse, type NextRequest } from "next/server";
import { consumeLoginToken } from "@/lib/auth";

/** Lien magique reçu par e-mail : ouvre la session puis redirige vers l'admin. */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const ok = await consumeLoginToken(token);
  const url = req.nextUrl.clone();
  url.search = "";
  url.pathname = ok ? "/admin" : "/admin/login";
  if (!ok) url.searchParams.set("erreur", "lien");
  return NextResponse.redirect(url);
}
