import type { Metadata } from "next";
import { getTexts } from "./data";

export async function pageMeta(k: string, path: string): Promise<Metadata> {
  const t = await getTexts();
  return { title: t[`p_${k}_title`], description: t[`p_${k}_seo`] || t[`p_${k}_intro`] || undefined, alternates: { canonical: path } };
}
