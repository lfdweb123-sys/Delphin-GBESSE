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
  const meta = [formatDate(n.date), n.author].filter(Boolean);
  return (
    <article className="mx-auto w-full max-w-6xl animate-up px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav aria-label="Fil d’Ariane" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-ink">Accueil</Link><span aria-hidden="true">/</span>
        <Link href="/actualites" className="hover:text-ink">Actualités</Link><span aria-hidden="true">/</span>
        <span className="line-clamp-1 text-ink" aria-current="page">{n.title}</span>
      </nav>
      <div className={n.image ? "grid items-start gap-8 lg:grid-cols-[5fr_7fr] lg:gap-14" : "mx-auto max-w-3xl"}>
        {n.image && (
          <figure className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-soft shadow-lg ring-1 ring-black/5 sm:aspect-[16/11] lg:aspect-[4/5]">
              <Image src={n.image} alt={n.title} fill priority sizes="(min-width:1024px) 42vw, 100vw" className="object-cover object-top" />
            </div>
          </figure>
        )}
        <div className="min-w-0">
          {n.category && <span className="inline-block rounded-full bg-black px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold">{n.category}</span>}
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.6rem]">{n.title}</h1>
          <p className="mt-4 text-sm text-muted">{meta.join("  ·  ")}</p>
          <span className="mt-6 block h-0.5 w-16 bg-gold" aria-hidden="true" />
          <div className="mt-8 whitespace-pre-line text-[1.05rem] leading-8 text-ink/90 sm:text-lg sm:leading-9">{n.content}</div>
          {n.sourceUrl && <p className="mt-8 text-sm text-muted">{t.label_source} : <a className="text-accent hover:underline" href={n.sourceUrl} target="_blank" rel="noopener noreferrer">{n.sourceName || n.sourceUrl}</a></p>}
          <NewsEngagement id={n.slug} title={n.title} path={`/actualites/${n.slug}`} />
          <Link href="/actualites" className="btn mt-10">{t.label_back_news}</Link>
        </div>
      </div>
    </article>
  );
}
