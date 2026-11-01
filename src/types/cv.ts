import { z } from "zod";
import { isCertainlyBefore, parseCvDate } from "../lib/dates.ts";

export const nonEmptyString = z
  .string()
  .refine((val) => val.trim().length > 0, {
    message: "String must not be empty or whitespace only",
  });

export const httpUrlSchema = z.string().refine(
  (val) => {
    try {
      const url = new URL(val);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  },
  { message: "Must be a valid http or https URL" },
);

export const portraitSchema = z.string().refine(
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
      'Portrait must be a root-relative path starting with "/" or a valid http(s) URL',
  },
);

export const dateString = z.string().superRefine((val, ctx) => {
  if (parseCvDate(val) === undefined) {
    ctx.addIssue({
      code: "custom",
      message: `"${val}" is not a valid date; use "Mon YYYY" (for example "Jan 2025") or "YYYY"`,
    });
  }
});

export const LINK_PLATFORMS = [
  "github",
  "linkedin",
  "x",
  "telegram",
  "instagram",
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
    headline: nonEmptyString,
    email: z.email(),
    phone: nonEmptyString,
    location: nonEmptyString,
    timeZone: z.string().optional(),
    website: httpUrlSchema.optional(),
    portrait: portraitSchema.optional(),
    socials: z.array(socialLinkSchema).optional(),
  })
  .strict();
export type Basics = z.infer<typeof basicsSchema>;

export const experienceItemSchema = z
  .object({
    company: nonEmptyString,
    title: nonEmptyString,
    startDate: dateString,
    endDate: dateString.optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    highlights: z.array(nonEmptyString).optional(),
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
    category: nonEmptyString,
    items: z.array(nonEmptyString),
  })
  .strict();
export type SkillCategory = z.infer<typeof skillCategorySchema>;

export const projectItemSchema = z
  .object({
    title: nonEmptyString,
    description: nonEmptyString,
    startDate: dateString,
    endDate: dateString.optional(),
    projectUrl: httpUrlSchema.optional(),
    liveUrl: httpUrlSchema.optional(),
    repositoryUrl: httpUrlSchema.optional(),
    technologies: z.array(nonEmptyString).optional(),
    highlights: z.array(nonEmptyString).optional(),
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
    endDate: dateString.optional(),
    honors: z.array(nonEmptyString).optional(),
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
  "Native",
  "Bilingual",
  "Professional Working",
  "Limited Working",
  "Basic",
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
    summary: z.string().optional(),
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
