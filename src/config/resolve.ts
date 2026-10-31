import type {
  BodySectionKey,
  ResolvedSiteConfig,
  SiteConfig,
} from "../types/site.ts";

export const ALL_BODY_SECTIONS: readonly BodySectionKey[] = [
  "summary",
  "experience",
  "skills",
  "projects",
  "education",
  "certifications",
  "publications",
  "languages",
] as const;

export const DEFAULT_SECTION_TITLES: Record<BodySectionKey, string> = {
  summary: "Summary",
  experience: "Experience",
  skills: "Skills",
  projects: "Projects",
  education: "Education",
  certifications: "Certifications",
  publications: "Research & Publications",
  languages: "Languages",
};

export function resolveSiteConfig(config: SiteConfig): ResolvedSiteConfig {
  const rawOrder = config.sectionOrder ?? ALL_BODY_SECTIONS;
  const seen = new Set<BodySectionKey>();
  const sectionOrder: BodySectionKey[] = [];

  for (const key of rawOrder) {
    if (ALL_BODY_SECTIONS.includes(key) && !seen.has(key)) {
      seen.add(key);
      sectionOrder.push(key);
    }
  }

  for (const key of ALL_BODY_SECTIONS) {
    if (!seen.has(key)) {
      seen.add(key);
      sectionOrder.push(key);
    }
  }

  const sectionVisibility = {} as Record<BodySectionKey, boolean>;
  for (const key of ALL_BODY_SECTIONS) {
    sectionVisibility[key] = config.sectionVisibility?.[key] !== false;
  }

  const sectionTitles = {} as Record<BodySectionKey, string>;
  for (const key of ALL_BODY_SECTIONS) {
    sectionTitles[key] =
      config.sectionTitles?.[key] ?? DEFAULT_SECTION_TITLES[key] ?? key;
  }

  const showPortrait = config.showPortrait !== false;

  return {
    showPortrait,
    sectionOrder,
    sectionVisibility,
    sectionTitles,
  };
}
