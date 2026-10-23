export type BodySectionKey =
  | "summary"
  | "experience"
  | "skills"
  | "projects"
  | "education"
  | "certifications"
  | "publications"
  | "languages";

export interface SiteConfig {
  sectionOrder?: BodySectionKey[];
  sectionVisibility?: Partial<Record<BodySectionKey, boolean>>;
  sectionTitles?: Partial<Record<BodySectionKey, string>>;
}

export interface ResolvedSiteConfig {
  sectionOrder: BodySectionKey[];
  sectionVisibility: Record<BodySectionKey, boolean>;
  sectionTitles: Record<BodySectionKey, string>;
}
