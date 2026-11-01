export const ALL_BODY_SECTIONS = [
  "summary",
  "experience",
  "skills",
  "projects",
  "education",
  "certifications",
  "publications",
  "languages",
] as const;

export type BodySectionKey = (typeof ALL_BODY_SECTIONS)[number];

export interface SiteConfig {
  showPortrait?: boolean;
  sectionOrder?: BodySectionKey[];
  sectionVisibility?: Partial<Record<BodySectionKey, boolean>>;
}

export interface ResolvedSiteConfig {
  showPortrait: boolean;
  sectionOrder: BodySectionKey[];
  sectionVisibility: Record<BodySectionKey, boolean>;
}
