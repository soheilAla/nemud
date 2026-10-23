export type LinkPlatform =
  | "github"
  | "linkedin"
  | "x"
  | "telegram"
  | "instagram";

export interface SocialLink {
  platform: LinkPlatform;
  url: string;
  label?: string;
}

export interface Basics {
  name: string;
  headline: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
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

export interface SkillCategory {
  category: string;
  items: string[];
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

export interface PublicationItem {
  title: string;
  publisher?: string;
  date: string;
  url?: string;
  description?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  honors?: string[];
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
  skills?: SkillCategory[];
  projects?: ProjectItem[];
  publications?: PublicationItem[];
  education?: EducationItem[];
  certifications?: CertificationItem[];
  languages?: LanguageItem[];
}
