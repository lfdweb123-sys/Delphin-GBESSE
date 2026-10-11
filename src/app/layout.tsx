import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TextsProvider } from "@/components/TextsProvider";
import { getProfile, getPublic, getSettings, getTexts, siteUrl } from "@/lib/data";
import { resolveNav } from "@/lib/texts";
import type { SocialLink } from "@/types";

export const revalidate = 60;
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const DEFAULT_NAME = "Delphin GBESSE";
const FALLBACK_ICON = "/favicon.ico";

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export async function generateMetadata(): Promise<Metadata> {
  const [profile, settings] = await Promise.all([getProfile(), getSettings()]);
  const name = profile?.name || DEFAULT_NAME;
  const title = settings?.siteTitle || name;
  const description = settings?.siteDescription || profile?.shortBio || `Site officiel de ${name}.`;
  const icon = settings?.logoUrl || FALLBACK_ICON;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s | ${name}` },
    description,
    alternates: { canonical: "/" },
    icons: {
      icon: [{ url: icon }],
      shortcut: [{ url: icon }],
      apple: [{ url: icon }],
    },
    openGraph: { title, description, url: siteUrl(), siteName: name, type: "website", locale: "fr_FR", images: profile?.photo ? [profile.photo] : undefined },
    twitter: { card: "summary_large_image", title, description },
  };
}

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [profile, settings, links, texts] = await Promise.all([getProfile(), getSettings(), getPublic<SocialLink>("socialLinks"), getTexts()]);
  const name = profile?.name || DEFAULT_NAME;
  const nav = resolveNav(texts);
  // Deux logos distincts : en-tête/menu (fond blanc) et pied de page (fond noir).
  const headerLogo = settings?.logoUrl;
  const footerLogo = str(settings?.logoFooterUrl);
  const footerImage = str(settings?.footerImageUrl);
  const person = {
    "@context": "https://schema.org", "@type": "Person", name, url: siteUrl(),
    ...(profile?.photo ? { image: new URL(profile.photo, siteUrl()).href } : {}),
    ...(profile?.shortBio ? { description: profile.shortBio } : {}),
    ...(links.length ? { sameAs: links.map((l) => l.url) } : {}),
  };
  return (
    <html lang="fr" className={`${sans.variable} ${serif.variable}`}>
      <body className="font-sans">
        <TextsProvider texts={texts}>
          <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">Aller au contenu</a>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
          <Header name={name} logoUrl={headerLogo} nav={nav} />
          <main id="contenu">{children}</main>
          <Footer name={name} logoUrl={footerLogo} imageUrl={footerImage} links={links} nav={nav} t={texts} profile={profile} />
        </TextsProvider>
      </body>
    </html>
  );
}
