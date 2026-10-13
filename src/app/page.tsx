import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Section from "@/components/Section";
import Gallery from "@/components/Gallery";
import SocialLinks from "@/components/SocialLinks";
import ContactSection from "@/components/ContactSection";
import FloatingActions from "@/components/FloatingActions";
import FeatureList, { AchievementFeatures, ServiceList, TimelineList } from "@/components/FeatureList";
import { aboutItems } from "@/lib/about";
import { isOwnFilterOnly } from "@/lib/gallery";
import { NewsCard, OrganizationCard } from "@/components/Cards";
import { byDateAsc, byDateDesc, byOrder, getProfile, getPublic, getTexts } from "@/lib/data";
import type { Achievement, Activity, EventItem, GalleryItem, NewsItem, Organization, SocialLink, TimelineEntry } from "@/types";

export const revalidate = 60;
const grid = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

export default async function Home() {
  const [t, profile, timeline, achievements, activities, orgs, news, gallery, socials] = await Promise.all([
    getTexts(), getProfile(), getPublic<TimelineEntry>("timeline"), getPublic<Achievement>("achievements"), getPublic<Activity>("activities"),
    getPublic<Organization>("organizations"),
    getPublic<NewsItem>("news"), getPublic<GalleryItem>("gallery"), getPublic<SocialLink>("socialLinks"),
  ]);
  const name = profile?.name || "Delphin GBESSE";
  const on = (k: string) => t[`s_${k}_show`] !== "Non";
  const ttl = (k: string) => t[`s_${k}_title`];
  const intro = (k: string) => t[`s_${k}_intro`] || undefined;
  const more = (k: string, href: string) => t[`s_${k}_more`] ? <div className="mt-8"><Link className="btn" href={href}>{t[`s_${k}_more`]}</Link></div> : null;
  const sec = (k: string, id: string | undefined, tone: "white" | "soft", children: ReactNode) =>
    <Section id={id} title={ttl(k)} intro={intro(k)} tone={tone}>{children}</Section>;

  const heroTitle = t.hero_title || name;
  const heroSub = t.hero_subtitle || profile?.roles;
  const heroText = t.hero_text || profile?.shortBio;
  const banner = t.hero_image;
  const bannerMobile = t.hero_image_mobile;
  const aboutImage = t.about_image;
  const responsibilities = profile?.responsibilities?.trim();
  const link = (href: string) => /^https?:\/\//.test(href) ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };
  const buttons = (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {t.hero_cta1_label && <Link {...link(t.hero_cta1_link)} className={`btn ${banner ? "border-white bg-white text-ink hover:bg-white/90" : "btn-primary"}`}>{t.hero_cta1_label}</Link>}
      {t.hero_cta2_label && <Link {...link(t.hero_cta2_link)} className={`btn ${banner ? "border-white/70 text-white hover:border-white" : ""}`}>{t.hero_cta2_label}</Link>}
    </div>
  );

  return (
    <>
      {banner ? (
        <section className="relative isolate overflow-hidden bg-ink text-white">
          {bannerMobile && <Image src={bannerMobile} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-60 md:hidden" />}
          <Image src={banner} alt="" fill sizes="100vw" className={`-z-10 object-cover opacity-60 ${bannerMobile ? "hidden md:block" : ""}`} />
          <div className="container-x animate-up py-20 sm:py-28 md:py-36">
            <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">{heroTitle}</h1>
            {heroSub && <p className="mt-4 max-w-2xl text-lg text-white/90">{heroSub}</p>}
            {heroText && <p className="mt-5 max-w-xl whitespace-pre-line leading-7 text-white/85">{heroText}</p>}
            {buttons}
          </div>
        </section>
      ) : (
        <section className="container-x grid items-center gap-10 py-14 sm:py-20 md:grid-cols-[1.4fr_1fr]">
          <div className="animate-up">
            <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{heroTitle}</h1>
            {heroSub && <p className="mt-4 text-lg text-muted">{heroSub}</p>}
            {heroText && <p className="mt-6 max-w-xl whitespace-pre-line leading-7 text-muted">{heroText}</p>}
            {buttons}
          </div>
          {profile?.photo && (
            <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl border border-line sm:max-w-sm">
              <Image src={profile.photo} alt={`Portrait de ${name}`} fill priority sizes="(min-width:768px) 30vw, 80vw" className="object-cover object-top" />
            </div>
          )}
        </section>
      )}

      {on("about") && aboutItems(profile, t, name).length > 0 && sec("about", "a-propos", "soft", <FeatureList items={aboutItems(profile, t, name)} />)}
      {on("timeline") && timeline.length > 0 && sec("timeline", undefined, "white", <><TimelineList items={[...timeline].sort(byDateAsc).slice(-5)} />{more("timeline", "/parcours")}</>)}
      {on("achievements") && achievements.length > 0 && sec("achievements", undefined, "soft", <><AchievementFeatures items={[...achievements].sort(byOrder).slice(0, 3)} />{more("achievements", "/materiels")}</>)}
      {on("activities") && activities.length > 0 && sec("activities", undefined, "white", <><ServiceList items={[...activities].sort(byOrder).slice(0, 4)} />{more("activities", "/services")}</>)}
      {on("organizations") && orgs.length > 0 && sec("organizations", undefined, "soft", <div className="grid gap-5 md:grid-cols-2">{orgs.map((o) => <OrganizationCard key={o.id} o={o} />)}</div>)}
      {on("news") && news.length > 0 && sec("news", undefined, "white", <><div className={grid}>{[...news].sort(byDateDesc).slice(0, 3).map((n) => <NewsCard key={n.id} n={n} />)}</div>{more("news", "/actualites")}</>)}
      {on("gallery") && gallery.length > 0 && sec("gallery", undefined, "soft", <><Gallery items={gallery.filter((g) => !isOwnFilterOnly(g.category)).slice(0, 8)} />{more("gallery", "/galerie")}</>)}
      {on("socials") && socials.length > 0 && sec("socials", undefined, "white", <SocialLinks links={socials} />)}
      {on("collaboration") && sec("collaboration", undefined, "soft", <Link href="/collaboration" className="btn btn-primary">{t.collab_cta_label}</Link>)}
      {on("contact") && sec("contact", undefined, "white", <ContactSection profile={profile} links={socials} />)}
      <FloatingActions whatsapp={profile?.whatsapp} />
    </>
  );
}
