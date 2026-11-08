export const ALL_BODY_SECTIONS = [
  "experience",
  "skills",
  "projects",
  "education",
  "certifications",
  "publications",
  "languages",
] as const;

export type BodySectionKey = (typeof ALL_BODY_SECTIONS)[number];

export const TOGGLEABLE_SECTIONS = [
  "experience",
  "projects",
  "education",
  "certifications",
  "publications",
  "languages",
] as const;

export type ToggleableSectionKey = (typeof TOGGLEABLE_SECTIONS)[number];

export interface SiteConfig {
  showPortrait?: boolean;
  sectionOrder?: BodySectionKey[];
  sectionVisibility?: Partial<Record<ToggleableSectionKey, boolean>>;
}

export interface ResolvedSiteConfig {
  showPortrait: boolean;
  sectionOrder: BodySectionKey[];
  sectionVisibility: Record<BodySectionKey, boolean>;
}
