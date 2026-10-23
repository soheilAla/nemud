import type { CV } from "../types/cv";

export const cvData: CV = {
  basics: {
    name: "Soheil Alaei",
    headline: "Software Engineer | Backend Development",
    email: "soheilalaei1001@gmail.com",
    phone: "+98 987 654 3210",
    location: "Karaj, Iran",
    socials: [
      {
        platform: "github",
        url: "https://github.com/soheilAla",
        username: "soheilAla",
        label: "GitHub",
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/soheilAla",
        username: "soheilAla",
        label: "LinkedIn",
      },
      {
        platform: "website",
        url: "https://soheildev.ir",
        label: "Portfolio",
      },
    ],
  },
  summary:
    "Junior Software Engineer focused on secure API design, clean architecture, and maintainable software. Emphasizes problem-solving, code quality, and building reliable systems, with a long-term interest in AI engineering.",
  experience: [
    {
      company: "Snapp Food",
      title: "Junior Backend Developer",
      startDate: "Jan 2025",
      endDate: "Present",
      location: "Tehran, Iran",
      description:
        "Developed backend APIs and database integrations for web applications, with a focus on security, maintainability, and clean architecture.",
      highlights: [
        "Implemented REST APIs with request validation, structured error handling, and consistent response schemas.",
        "Designed database models and managed schema changes using SQLAlchemy and Alembic.",
      ],
    },
    {
      company: "Digikala AD",
      title: "Backend Development Intern",
      startDate: "Jul 2024",
      endDate: "Jan 2025",
      location: "Tehran, Iran",
      description:
        "Contributed to backend development tasks and database integration for internal web applications.",
      highlights: [
        "Built API endpoints and integrated database operations for core application features.",
        "Used Git for version control and Docker Compose to run local development services.",
      ],
    },
    {
      company: "Freelance",
      title: "Freelance Backend Developer",
      startDate: "Jan 2024",
      endDate: "Jun 2024",
      location: "Remote",
      description:
        "Built customized backend solutions, database integrations, and automation tools for client web applications.",
      highlights: [
        "Designed RESTful APIs using FastAPI and PostgreSQL with automated request validation.",
        "Configured Dockerized deployment environments on Linux servers for reliable hosting.",
      ],
    },
  ],
  skills: [
    {
      category: "Backend Development",
      items: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy"],
    },
    {
      category: "Frontend Development",
      items: ["TypeScript", "Vue.js", "Tailwind CSS"],
    },
    {
      category: "Tools & Infrastructure",
      items: ["Docker", "Linux", "Git", "GitHub Actions"],
    },
  ],
  projects: [
    {
      title: "Zero Drop",
      description:
        "Privacy-focused paste service with client-side encryption for text sharing.",
      liveUrl: "https://zerodrop.dev",
      repositoryUrl: "https://github.com/soheilAla/zero-drop",
      technologies: [
        "Python",
        "FastAPI",
        "PostgreSQL",
        "SQLAlchemy",
        "Alembic",
        "Vue.js",
        "TypeScript",
        "Docker",
      ],
      highlights: [
        "Designed client-side encryption so plaintext content and decryption keys are not sent to the server.",
        "Implemented expiring content, access limits, and burn-after-read behavior.",
      ],
    },
    {
      title: "Secure Lens",
      description:
        "Command-line security configuration scanner with Jev powered risk assessment.",
      repositoryUrl: "https://github.com/soheilAla/secure-lens",
      technologies: ["Python", "Pydantic", "Github Actions", "Jev SDK"],
    },
  ],
  education: [
    {
      institution: "Iran University of Science and Technology",
      degree: "B.Sc.",
      field: "Computer Science",
      startDate: "2026",
      endDate: "Present",
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
