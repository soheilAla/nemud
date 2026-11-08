import { z } from "zod";

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
export const bodySectionKeySchema = z.enum(ALL_BODY_SECTIONS);

export const TOGGLEABLE_SECTIONS = [
  "experience",
  "projects",
  "education",
  "certifications",
  "publications",
  "languages",
] as const;

export type ToggleableSectionKey = (typeof TOGGLEABLE_SECTIONS)[number];
export const toggleableSectionKeySchema = z.enum(TOGGLEABLE_SECTIONS);

export const sectionVisibilitySchema = z
  .object({
    experience: z.boolean().optional(),
    projects: z.boolean().optional(),
    education: z.boolean().optional(),
    certifications: z.boolean().optional(),
    publications: z.boolean().optional(),
    languages: z.boolean().optional(),
  })
  .strict();

export const siteConfigSchema = z
  .object({
    $schema: z.string().optional(),
    showPortrait: z
      .boolean()
      .optional()
      .describe("Toggle portrait display in the header."),
    sectionOrder: z
      .array(bodySectionKeySchema)
      .optional()
      .describe("Display order of body sections."),
    sectionVisibility: sectionVisibilitySchema
      .optional()
      .describe("Toggle visibility for optional sections."),
  })
  .strict();

export type SiteConfig = z.infer<typeof siteConfigSchema>;

export interface ResolvedSiteConfig {
  showPortrait: boolean;
  sectionOrder: BodySectionKey[];
  sectionVisibility: Record<BodySectionKey, boolean>;
}
