import type { CV } from "../types/cv";

export const cvData: CV = {
  basics: {
    name: "Soheil Alaei",
    headline: "Software Engineer - Backend Development",
    email: "SoheilAlaei1001@gmail.com",
    phone: "+98 987 654 3210",
    location: "Karaj, Iran",
    timeZone: "UTC+3:30",
    website: "https://SoheilAla.ir",
    socials: [
      {
        platform: "github",
        url: "https://github.com/soheilAla",
        label: "GitHub",
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/soheilAla",
        label: "LinkedIn",
      },
      {
        platform: "telegram",
        url: "https://t.me/iS0heil",
        label: "Telegram",
      },
      {
        platform: "x",
        url: "https://x.com/iS0heil",
        label: "X",
      },
      {
        platform: "instagram",
        url: "https://instagram.com/example",
        label: "Instagram",
      },
    ],
  },
  summary:
    "Junior Software Engineer with over 1 year of experience in Python backend development, focused on secure API design, database integration, and maintainable software. Also interested in AI engineering.",
  experience: [
    {
      company: "Snapp Food",
      title: "Junior Backend Developer",
      startDate: "Jan 2025",
      location: "Tehran, Iran",
      description:
        "Developed backend APIs and database integrations for web applications, with a focus on security, maintainability, and clean architecture.",
      highlights: [
        "Designed database models and managed schema changes using SQLAlchemy and Alembic.",
      ],
    },
    {
      company: "Digikala AD",
      title: "Intern Backend Developer",
      startDate: "Jul 2024",
      endDate: "Jan 2025",
      location: "Tehran, Iran",
      description:
        "Contributed to backend development tasks and database integration for internal web applications.",
      highlights: [
        "Built API endpoints and integrated database operations for core application features.",
      ],
    },
    {
      company: "Self-employed",
      title: "Freelance Backend Developer",
      startDate: "Jan 2024",
      endDate: "Jun 2024",
      description:
        "Built customized backend solutions, database integrations, and automation tools for client web applications.",
    },
  ],
  skills: [
    {
      category: "Languages & Runtimes",
      items: ["Python", "SQL", "TypeScript"],
    },
    {
      category: "Backend",
      items: [
        "FastAPI",
        "PostgreSQL",
        "SQLAlchemy",
        "Alembic",
        "Pydantic",
        "REST APIs",
      ],
    },
    {
      category: "Tools & Infrastructure",
      items: ["Docker", "Linux", "Git", "GitHub Actions", "CI/CD"],
    },
    {
      category: "Frontend",
      items: ["Vue.js", "Tailwind CSS"],
    },
  ],
  projects: [
    {
      title: "Zero Drop",
      description:
        "Privacy-focused paste service with client-side encryption for text sharing.",
      startDate: "2024",
      endDate: "2025",
      liveUrl: "https://zerodrop.dev",
      repositoryUrl: "https://github.com/soheilAla/zero-drop",
      technologies: [
        "Python",
        "FastAPI",
        "PostgreSQL",
        "SQLAlchemy",
        "Alembic",
        "Docker",
        "TypeScript",
        "Vue.js",
        "Tailwind CSS",
      ],
      highlights: [
        "Implemented browser-side AES-256-GCM encryption, keeping plaintext content and decryption keys out of server requests.",
        "Added password-based encryption using PBKDF2, alongside API rate limiting and security headers.",
      ],
    },
    {
      title: "Secure Lens",
      description:
        "Command-line security configuration scanner with Jev powered risk assessment.",
      startDate: "2024",
      repositoryUrl: "https://github.com/soheilAla/secure-lens",
      technologies: ["Python", "Pydantic", "GitHub Actions", "Jev SDK"],
      highlights: [
        "Built modular static checks for exposed secrets, insecure environment settings, Dockerfile risks, and Git configuration issues.",
      ],
    },
  ],
  education: [
    {
      institution: "Iran University of Science and Technology",
      degree: "B.Sc.",
      field: "Computer Science",
      startDate: "2025",
      honors: ["Outstanding Performance in Computer Science Coursework (2026)"],
    },
  ],
  certifications: [
    {
      name: "CS50x Puzzle Day",
      issuer: "Harvard University",
      date: "2025",
      url: "https://cs50.harvard.edu/certificates/edd5b56f-908a-4614-9a92-284eb8842603",
    },
  ],
  publications: [
    {
      title:
        "Zero-Knowledge Client-Side Encryption Patterns for Distributed Ephemeral Data Stores",
      publisher: "International Conference on Software Architecture & Security",
      date: "2025",
      url: "https://example.com/publications/zk-client-encryption",
      description:
        "Analyzed threat models and latency trade-offs for zero-trust encryption in ephemeral paste systems.",
    },
  ],
  languages: [
    {
      name: "Persian",
      proficiency: "Native",
    },
    {
      name: "English",
      proficiency: "Professional Working",
    },
  ],
};
