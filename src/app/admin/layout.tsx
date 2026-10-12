import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { currentAdmin } from "@/lib/auth";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "Espace admin",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin/chantiers", label: "Chantiers" },
  { href: "/admin/journal", label: "Journal" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/avis", label: "Avis clients" },
  { href: "/admin/prestations", label: "Prestations" },
];

/** Habillage de l'admin : sobre, lisible, pensé pour un usage sur ordinateur comme sur téléphone. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const email = await currentAdmin();

  return (
    <div className="admin min-h-screen bg-sand text-ink">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3 md:px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/assets/brand/logo-black.webp" alt="La Casa de Anna" width={1462} height={676} className="h-9 w-auto" />
            <span className="label text-lin">Admin</span>
          </Link>
          {email && (
            <>
              <nav className="order-3 flex w-full gap-1 overflow-x-auto md:order-none md:w-auto">
                {NAV.map((n) => (
                  <Link key={n.href} href={n.href} className="admin-nav-link">
                    {n.label}
                  </Link>
                ))}
              </nav>
              <div className="ml-auto flex items-center gap-4 text-sm">
                <Link href="/" target="_blank" className="text-lin hover:text-ink">
                  Voir le site ↗
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="text-lin hover:text-ink">
                    Déconnexion
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">{children}</main>
    </div>
  );
}
