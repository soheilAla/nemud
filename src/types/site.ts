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
  showPortrait?: boolean;
  sectionOrder?: BodySectionKey[];
  sectionVisibility?: Partial<Record<BodySectionKey, boolean>>;
  sectionTitles?: Partial<Record<BodySectionKey, string>>;
}

export interface ResolvedSiteConfig {
  showPortrait: boolean;
  sectionOrder: BodySectionKey[];
  sectionVisibility: Record<BodySectionKey, boolean>;
  sectionTitles: Record<BodySectionKey, string>;
}
