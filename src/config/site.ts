import type { SiteConfig } from "../types/site.ts";

export const siteConfig: SiteConfig = {
  // Reorder keys to change the CV reading structure
  sectionOrder: [
    "summary",
    "experience",
    "skills",
    "projects",
    "publications",
    "education",
    "certifications",
    "languages",
  ],

  // Set any section to false to hide it even if data exists
  sectionVisibility: {
    summary: true,
    experience: true,
    skills: true,
    projects: true,
    education: true,
    certifications: true,
    publications: true,
    languages: true,
  },

  // Optional custom overrides
  sectionTitles: {
  },
};
