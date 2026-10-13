import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getNewsBySlug, getPublic, getTexts, siteUrl } from "@/lib/data";
import NewsEngagement from "@/components/NewsEngagement";
import type { NewsItem } from "@/types";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getPublic<NewsItem>("news")).map((n) => ({ slug: n.slug }));
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const n = await getNewsBySlug(params.slug);
  if (!n) return { title: "Article introuvable" };
  const description = (n.content ?? "").slice(0, 160);
  return { title: n.title, description, alternates: { canonical: `/actualites/${n.slug}` },
    openGraph: { title: n.title, description, type: "article", publishedTime: n.date, images: n.image ? [n.image] : undefined },
    twitter: { card: "summary_large_image", title: n.title, description } };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const [n, t] = await Promise.all([getNewsBySlug(params.slug), getTexts()]);
  if (!n) notFound();
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: n.title, datePublished: n.date,
    ...(n.image ? { image: n.image } : {}), ...(n.author ? { author: { "@type": "Person", name: n.author } } : {}),
    mainEntityOfPage: `${siteUrl()}/actualites/${n.slug}` };
  return (
    <article className="container-x max-w-3xl animate-up py-14 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Link href="/actualites" className="text-sm text-muted hover:text-ink">{t.label_back_news}</Link>
      <p className="mt-6 text-sm text-muted">{formatDate(n.date)}{n.category ? ` — ${n.category}` : ""}{n.author ? ` — ${n.author}` : ""}</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{n.title}</h1>
      {n.image && <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-soft"><Image src={n.image} alt={n.title} fill priority sizes="(min-width:768px) 768px, 100vw" className="object-cover object-top" /></div>}
      <div className="prose-plain mt-8 whitespace-pre-line text-lg text-ink/90">{n.content}</div>
      {n.sourceUrl && <p className="mt-8 text-sm text-muted">{t.label_source} : <a className="text-accent hover:underline" href={n.sourceUrl} target="_blank" rel="noopener noreferrer">{n.sourceName || n.sourceUrl}</a></p>}
      <NewsEngagement id={n.slug} title={n.title} path={`/actualites/${n.slug}`} />
    </article>
  );
}
