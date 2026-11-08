import { z } from "zod";
import { isCertainlyBefore, parseCvDate } from "../lib/dates.ts";

export const nonEmptyString = z
  .string()
  .refine((val) => val.trim().length > 0, {
    message: "String must not be empty or whitespace only",
  });

export const httpUrlSchema = z
  .string()
  .refine(
    (val) => {
      try {
        const url = new URL(val);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Must be a valid HTTP or HTTPS URL" },
  )
  .describe("A valid HTTP or HTTPS URL.");

export const portraitSchema = z
  .string()
  .refine(
    (val) => {
      if (val.startsWith("/")) return true;
      try {
        const url = new URL(val);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    {
      message:
        'Portrait must be a root-relative path starting with "/" or a valid HTTP(S) URL',
    },
  )
  .describe('Image URL or root-relative path (e.g. "/portrait.jpg").');

export const dateString = z
  .string()
  .superRefine((val, ctx) => {
    if (parseCvDate(val) === undefined) {
      ctx.addIssue({
        code: "custom",
        message: `"${val}" is not a valid date; use "Mon YYYY" (for example "Jan 2025") or "YYYY"`,
      });
    }
  })
  .describe('Use "Mon YYYY" (e.g. "Jan 2025") or "YYYY".');

export const LINK_PLATFORMS = [
  "github",
  "gitlab",
  "linkedin",
  "telegram",
  "whatsapp",
] as const;

export const linkPlatformSchema = z.enum(LINK_PLATFORMS, {
  message: `expected one of ${LINK_PLATFORMS.join(" | ")}`,
});
export type LinkPlatform = z.infer<typeof linkPlatformSchema>;

export const socialLinkSchema = z
  .object({
    platform: linkPlatformSchema,
    url: httpUrlSchema,
    label: z.string().optional(),
  })
  .strict();

export type SocialLink = z.infer<typeof socialLinkSchema>;

export const basicsSchema = z
  .object({
    name: nonEmptyString,
    headline: nonEmptyString.describe("Professional title or target role."),
    email: z.email(),
    phone: nonEmptyString,
    location: nonEmptyString.describe(
      "City and country, or preferred location format.",
    ),
    timeZone: nonEmptyString.describe("Time zone (e.g. UTC+3:30)."),
    website: httpUrlSchema.optional(),
    portrait: portraitSchema.optional(),
    socials: z.array(socialLinkSchema).optional(),
  })
  .strict();

export type Basics = z.infer<typeof basicsSchema>;

export const WORK_MODES = ["On-site", "Hybrid", "Remote"] as const;

export const workModeSchema = z.enum(WORK_MODES, {
  message: `expected one of ${WORK_MODES.join(" | ")}`,
});

export type WorkMode = z.infer<typeof workModeSchema>;

export const experienceItemSchema = z
  .object({
    company: nonEmptyString,
    title: nonEmptyString.describe("Job title or position."),
    startDate: dateString,
    endDate: dateString
      .optional()
      .describe("Leave empty for a current position."),
    location: z.string().optional(),
    workMode: workModeSchema.optional(),
    description: z
      .string()
      .optional()
      .describe("Brief overview of your responsibilities."),
    highlights: z
      .array(nonEmptyString)
      .optional()
      .describe("Key achievements and measurable results."),
  })
  .strict()
  .superRefine((item, ctx) => {
    if (item.startDate && item.endDate) {
      const start = parseCvDate(item.startDate);
      const end = parseCvDate(item.endDate);
      if (start && end && isCertainlyBefore(end, start)) {
        ctx.addIssue({
          code: "custom",
          message: `endDate (${item.endDate}) is before startDate (${item.startDate})`,
          path: ["endDate"],
        });
      }
    }
  });

export type ExperienceItem = z.infer<typeof experienceItemSchema>;

export const skillCategorySchema = z
  .object({
    category: nonEmptyString.describe(
      "Skill group name (e.g. Backend, Languages).",
    ),
    items: z
      .array(nonEmptyString)
      .nonempty("Skill category must contain at least one item")
      .describe("Skills belonging to this category."),
  })
  .strict();

export type SkillCategory = z.infer<typeof skillCategorySchema>;

export const projectItemSchema = z
  .object({
    title: nonEmptyString,
    description: nonEmptyString,
    startDate: dateString,
    endDate: dateString
      .optional()
      .describe("Leave empty for an ongoing project."),
    projectUrl: httpUrlSchema.optional().describe("General project page."),
    liveUrl: httpUrlSchema.optional().describe("Live deployment URL."),
    repositoryUrl: httpUrlSchema
      .optional()
      .describe("Source code repository URL."),
    technologies: z
      .array(nonEmptyString)
      .optional()
      .describe("Technologies and tools used."),
    highlights: z
      .array(nonEmptyString)
      .optional()
      .describe("Key features, contributions, or results."),
  })
  .strict()
  .superRefine((item, ctx) => {
    if (item.startDate && item.endDate) {
      const start = parseCvDate(item.startDate);
      const end = parseCvDate(item.endDate);
      if (start && end && isCertainlyBefore(end, start)) {
        ctx.addIssue({
          code: "custom",
          message: `endDate (${item.endDate}) is before startDate (${item.startDate})`,
          path: ["endDate"],
        });
      }
    }
  });

export type ProjectItem = z.infer<typeof projectItemSchema>;

export const publicationItemSchema = z
  .object({
    title: nonEmptyString,
    publisher: z.string().optional(),
    date: dateString,
    url: httpUrlSchema.optional(),
    description: z.string().optional(),
  })
  .strict();

export type PublicationItem = z.infer<typeof publicationItemSchema>;

export const educationItemSchema = z
  .object({
    institution: nonEmptyString,
    degree: nonEmptyString,
    field: z.string().optional(),
    startDate: dateString,
    endDate: dateString
      .optional()
      .describe("Leave empty if currently studying."),
    topGrades: z
      .array(
        z
          .object({
            label: nonEmptyString,
            grade: nonEmptyString,
          })
          .strict(),
      )
      .optional()
      .describe("Notable grades or GPA."),
    honors: z
      .array(nonEmptyString)
      .optional()
      .describe("Academic honors, awards, or distinctions."),
  })
  .strict()
  .superRefine((item, ctx) => {
    if (item.startDate && item.endDate) {
      const start = parseCvDate(item.startDate);
      const end = parseCvDate(item.endDate);
      if (start && end && isCertainlyBefore(end, start)) {
        ctx.addIssue({
          code: "custom",
          message: `endDate (${item.endDate}) is before startDate (${item.startDate})`,
          path: ["endDate"],
        });
      }
    }
  });

export type EducationItem = z.infer<typeof educationItemSchema>;

export const certificationItemSchema = z
  .object({
    name: nonEmptyString,
    issuer: nonEmptyString,
    date: dateString,
    url: httpUrlSchema.optional(),
  })
  .strict();

export type CertificationItem = z.infer<typeof certificationItemSchema>;

export const LANGUAGE_PROFICIENCIES = [
  "Elementary",
  "Limited Working",
  "Professional Working",
  "Full Professional",
  "Native or Bilingual",
] as const;

export const languageProficiencySchema = z.enum(LANGUAGE_PROFICIENCIES, {
  message: `expected one of ${LANGUAGE_PROFICIENCIES.join(" | ")}`,
});

export const languageItemSchema = z
  .object({
    name: nonEmptyString,
    proficiency: languageProficiencySchema,
  })
  .strict();

export type LanguageItem = z.infer<typeof languageItemSchema>;

export const cvSchema = z
  .object({
    $schema: z.string().optional(),
    basics: basicsSchema,
    summary: z.string().optional().describe("A concise professional summary."),
    experience: z.array(experienceItemSchema).optional(),
    skills: z.array(skillCategorySchema).optional(),
    projects: z.array(projectItemSchema).optional(),
    publications: z.array(publicationItemSchema).optional(),
    education: z.array(educationItemSchema).optional(),
    certifications: z.array(certificationItemSchema).optional(),
    languages: z.array(languageItemSchema).optional(),
  })
  .strict();

export type CV = z.infer<typeof cvSchema>;
