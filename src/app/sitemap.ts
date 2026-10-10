import type { MetadataRoute } from "next";
import { getPublic, siteUrl } from "@/lib/data";
import type { NewsItem } from "@/types";

export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const pages = ["", "/parcours", "/realisations", "/activites", "/evenements", "/actualites", "/galerie", "/collaboration", "/contact"];
  const news = await getPublic<NewsItem>("news");
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...news.map((n) => ({ url: `${base}/actualites/${n.slug}`, lastModified: n.date, priority: 0.6 })),
  ];
}
