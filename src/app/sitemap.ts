import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getArticles, getProjects } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, journal] = await Promise.all([getProjects(), getArticles()]);
  const now = new Date();

  const staticRoutes = [
    "",
    "/studio",
    "/prestations",
    "/realisations",
    "/journal",
    "/contact",
    "/mentions-legales",
    "/politique-confidentialite",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: (path === "" ? "monthly" : "yearly") as "monthly" | "yearly",
    priority: path === "" ? 1 : 0.7,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${site.url}/realisations/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const journalRoutes = journal.map((a) => ({
    url: `${site.url}/journal/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...journalRoutes];
}
