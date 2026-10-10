export type VerificationStatus = "verified" | "needs_review";
export type PublishStatus = "published" | "draft";
export type SourceType = "presse" | "institution" | "document_officiel" | "réseau_social" | "site_web" | "vidéo" | "autre";

export interface Source {
  id?: string;
  name: string;
  url: string;
  type: SourceType;
  publishedAt?: string;
  collectedAt: string;
  verificationStatus: VerificationStatus;
}

/** Champs communs à tous les contenus administrables. */
export interface BaseDoc {
  id: string;
  status: PublishStatus;
  verificationStatus: VerificationStatus;
  sourceName?: string;
  sourceUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface Profile extends BaseDoc {
  name: string; photo?: string; shortBio?: string; fullBio?: string; presentation?: string;
  roles?: string; responsibilities?: string; location?: string; domains?: string;
  phone?: string; whatsapp?: string; email?: string;
}
export interface SiteSettings extends BaseDoc {
  logoUrl?: string; siteTitle?: string; siteDescription?: string; collaborationText?: string;
}
export interface TimelineEntry extends BaseDoc { title: string; date: string; description?: string; category?: string; image?: string; url?: string; }
export interface EventItem extends BaseDoc { title: string; description?: string; date: string; endDate?: string; time?: string; location?: string; image?: string; participants?: string; url?: string; }
export interface Achievement extends BaseDoc { title: string; description?: string; date?: string; category?: string; image?: string; result?: string; url?: string; }
export interface Activity extends BaseDoc { title: string; description?: string; date?: string; category?: string; image?: string; url?: string; }
export interface Project extends BaseDoc { title: string; description?: string; date?: string; category?: string; image?: string; url?: string; }
export interface Organization extends BaseDoc { name: string; description?: string; role?: string; period?: string; logo?: string; website?: string; }
export interface NewsItem extends BaseDoc { title: string; slug: string; content?: string; image?: string; date: string; author?: string; category?: string; }
export interface GalleryItem extends BaseDoc { title?: string; image: string; alt: string; category?: string; }
export interface SocialLink extends BaseDoc { network: string; url: string; }

export type CollectionName =
  | "timeline" | "events" | "activities" | "achievements" | "projects"
  | "organizations" | "news" | "gallery" | "socialLinks";
