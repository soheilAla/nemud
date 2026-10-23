export type LinkPlatform = "github" | "linkedin" | "x" | "telegram" | "website";

export interface SocialLink {
  platform: LinkPlatform;
  url: string;
  label?: string;
  username?: string;
}

export interface Basics {
  name: string;
  headline: string;
  email?: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  socials?: SocialLink[];
}

export interface ExperienceItem {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
  highlights?: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  honors?: string[];
}

export interface ProjectItem {
  title: string;
  description: string;
  projectUrl?: string;
  liveUrl?: string;
  repositoryUrl?: string;
  technologies?: string[];
  highlights?: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface LanguageItem {
  name: string;
  proficiency:
    | "Native"
    | "Bilingual"
    | "Professional Working"
    | "Limited Working"
    | "Basic";
}

export interface CV {
  basics: Basics;
  summary?: string;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  projects?: ProjectItem[];
  skills?: SkillCategory[];
  certifications?: CertificationItem[];
  languages?: LanguageItem[];
}
