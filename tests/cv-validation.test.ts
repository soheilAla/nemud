import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCvDate } from "../src/lib/dates.ts";
import { parseCv } from "../src/lib/validate-cv.ts";
import { dateString } from "../src/types/cv.ts";

const minimalValidCV = {
  basics: {
    name: "Alex Smith",
    headline: "Full-Stack Developer",
    email: "alex@example.com",
    phone: "+1 555 123 4567",
    location: "Chicago, IL",
  },
};

const fullValidCV = {
  $schema: "./cv.schema.json",
  basics: {
    name: "Jordan Lee",
    headline: "Systems Engineer",
    email: "jordan@example.com",
    phone: "+1 555 987 6543",
    location: "Austin, TX",
    timeZone: "UTC-06:00",
    website: "https://example.org",
    portrait: "/portrait.webp",
    socials: [
      {
        platform: "github",
        url: "https://github.com/example",
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/example",
        label: "LinkedIn",
      },
    ],
  },
  summary: "Experienced software engineer specializing in distributed systems.",
  experience: [
    {
      company: "Acme Corp",
      title: "Senior Engineer",
      startDate: "Jan 2023",
      location: "Austin, TX",
      description: "Leading cloud architecture.",
      highlights: ["Built streaming pipeline."],
    },
    {
      company: "Beta Tech",
      title: "Software Engineer",
      startDate: "Jun 2020",
      endDate: "Dec 2022",
      highlights: ["Maintained APIs."],
    },
  ],
  skills: [
    {
      category: "Languages",
      items: ["TypeScript", "Go", "Rust"],
    },
  ],
  projects: [
    {
      title: "Project Alpha",
      description: "Fast distributed cache engine.",
      startDate: "Jan 2021",
      endDate: "Mar 2021",
      repositoryUrl: "https://github.com/example/alpha",
      technologies: ["Rust", "Tokio"],
    },
    {
      title: "Legacy Tool",
      description: "Older tool ranked higher.",
      startDate: "2019",
      endDate: "2020",
    },
  ],
  publications: [
    {
      title: "Consensus in Edge Networks",
      publisher: "IEEE Transactions",
      date: "2023",
      url: "https://example.org/paper",
    },
  ],
  education: [
    {
      institution: "State University",
      degree: "B.S.",
      field: "Computer Science",
      startDate: "2016",
      endDate: "2020",
      honors: ["Summa Cum Laude"],
    },
  ],
  certifications: [
    {
      name: "Cloud Solutions Architect",
      issuer: "AWS",
      date: "2024",
      url: "https://example.org/cert",
    },
  ],
  languages: [
    {
      name: "English",
      proficiency: "Native",
    },
    {
      name: "Spanish",
      proficiency: "Professional Working",
    },
  ],
};

test("1. A valid minimal CV passes; a full valid CV passes with zero warnings", () => {
  const minResult = parseCv(minimalValidCV);
  assert.equal(minResult.cv.basics.name, "Alex Smith");
  assert.equal(minResult.warnings.length, 0);

  const fullResult = parseCv(fullValidCV);
  assert.equal(fullResult.cv.basics.name, "Jordan Lee");
  assert.equal(fullResult.warnings.length, 0);
});

test("2. Unknown key at root and inside an item is rejected", () => {
  assert.throws(
    () => parseCv({ ...minimalValidCV, extraKey: "not allowed" }),
    /extraKey/,
  );

  const cvWithItemTypo = {
    ...minimalValidCV,
    experience: [
      {
        company: "Acme",
        title: "Engineer",
        startDate: "2020",
        startdate: "2020",
      },
    ],
  };
  assert.throws(() => parseCv(cvWithItemTypo), /startdate/);
});

test("3. Missing required field and wrong type are rejected; invalid proficiency is rejected", () => {
  assert.throws(() => parseCv({ basics: { headline: "Dev" } }), /basics\.name/);

  assert.throws(
    () => parseCv({ basics: { ...minimalValidCV.basics, name: 12345 } }),
    /basics\.name/,
  );

  assert.throws(
    () =>
      parseCv({
        ...minimalValidCV,
        languages: [{ name: "German", proficiency: "Fluent" }],
      }),
    /expected one of Native \| Bilingual \| Professional Working \| Limited Working \| Basic/,
  );
});

test("4. Date format: accepts Mon YYYY and YYYY; rejects invalid formats", () => {
  const validDates = ["Jan 2025", "Dec 1999", "2025"];
  for (const d of validDates) {
    assert.doesNotThrow(() => dateString.parse(d));
  }

  const rejectedDates = [
    "January 2025",
    "jan 2025",
    "JAN 2025",
    "Jan 25",
    "2025-01",
    "01/2025",
    "Present",
    "2025 ",
    " Jan 2025",
    "",
  ];
  for (const r of rejectedDates) {
    assert.throws(() => dateString.parse(r), /is not a valid date/);
  }
});

test("5. Range: section 3 examples behave as stated; missing endDate is accepted", () => {
  // start "Jul 2024", end "Mar 2024": error
  assert.throws(
    () =>
      parseCv({
        ...minimalValidCV,
        experience: [
          {
            company: "Co",
            title: "Role",
            startDate: "Jul 2024",
            endDate: "Mar 2024",
          },
        ],
      }),
    /endDate \(Mar 2024\) is before startDate \(Jul 2024\)/,
  );

  // start "2025", end "2025": ok
  assert.doesNotThrow(() =>
    parseCv({
      ...minimalValidCV,
      experience: [
        {
          company: "Co",
          title: "Role",
          startDate: "2025",
          endDate: "2025",
        },
      ],
    }),
  );

  // start "Jun 2025", end "2025": ok
  assert.doesNotThrow(() =>
    parseCv({
      ...minimalValidCV,
      experience: [
        {
          company: "Co",
          title: "Role",
          startDate: "Jun 2025",
          endDate: "2025",
        },
      ],
    }),
  );

  // start "2025", end "Mar 2025": ok
  assert.doesNotThrow(() =>
    parseCv({
      ...minimalValidCV,
      experience: [
        {
          company: "Co",
          title: "Role",
          startDate: "2025",
          endDate: "Mar 2025",
        },
      ],
    }),
  );

  // missing endDate is accepted
  const missingEnd = parseCv({
    ...minimalValidCV,
    experience: [
      {
        company: "Co",
        title: "Role",
        startDate: "2024",
      },
    ],
  });
  assert.equal(missingEnd.cv.experience?.[0]?.endDate, undefined);
});

test("6. Whitespace-only required strings are rejected", () => {
  assert.throws(
    () =>
      parseCv({
        basics: {
          ...minimalValidCV.basics,
          name: "   ",
        },
      }),
    /basics\.name/,
  );

  assert.throws(
    () =>
      parseCv({
        ...minimalValidCV,
        experience: [
          {
            company: "   ",
            title: "Dev",
            startDate: "2024",
          },
        ],
      }),
    /experience\[0\]\.company/,
  );

  assert.throws(
    () =>
      parseCv({
        ...minimalValidCV,
        skills: [{ category: "Tools", items: ["Git", "  "] }],
      }),
    /skills\[0\]\.items\[1\]/,
  );
});

test("7. Invalid URL is rejected; /portrait.webp and https://example.org/a.webp are accepted for portrait", () => {
  assert.throws(
    () =>
      parseCv({
        ...minimalValidCV,
        basics: {
          ...minimalValidCV.basics,
          website: "not-a-valid-url",
        },
      }),
    /basics\.website/,
  );

  assert.throws(
    () =>
      parseCv({
        ...minimalValidCV,
        basics: {
          ...minimalValidCV.basics,
          portrait: "invalid-relative-path.webp",
        },
      }),
    /basics\.portrait/,
  );

  const localPortrait = parseCv({
    ...minimalValidCV,
    basics: {
      ...minimalValidCV.basics,
      portrait: "/portrait.webp",
    },
  });
  assert.equal(localPortrait.cv.basics.portrait, "/portrait.webp");

  const remotePortrait = parseCv({
    ...minimalValidCV,
    basics: {
      ...minimalValidCV.basics,
      portrait: "https://example.org/a.webp",
    },
  });
  assert.equal(remotePortrait.cv.basics.portrait, "https://example.org/a.webp");
});

test("8. Several errors in one document are all reported in one thrown error, with correct paths", () => {
  const invalidCV = {
    basics: {
      name: "",
      headline: "Dev",
      email: "bad-email",
      phone: "+1 555 1234",
      location: "City",
    },
    languages: [
      {
        name: "French",
        proficiency: "Superb",
      },
    ],
  };

  try {
    parseCv(invalidCV);
    assert.fail("Expected parseCv to throw");
  } catch (err) {
    const msg = (err as Error).message;
    assert.match(msg, /\[cv\] Invalid cv\.json \(\d+ errors\)/);
    assert.match(msg, /basics\.name:/);
    assert.match(msg, /basics\.email:/);
    assert.match(msg, /languages\[0\]\.proficiency:/);
  }
});

test("9. Order warnings: correctly ordered gives no warning; swapped gives exactly one warning; Present sorts first; two Present ordered by start; equal ends decided by start; year-only vs month dates overlap give no warning; projects out of date order give no warning; certifications ordered by date", () => {
  // Correctly ordered experience: no warning
  const orderedExp = parseCv({
    ...minimalValidCV,
    experience: [
      {
        company: "Co A",
        title: "Role A",
        startDate: "Jan 2023",
        endDate: "Dec 2024",
      },
      {
        company: "Co B",
        title: "Role B",
        startDate: "Jan 2021",
        endDate: "Dec 2022",
      },
    ],
  });
  assert.equal(orderedExp.warnings.length, 0);

  // Swapped experience: exactly one warning with right indexes
  const swappedExp = parseCv({
    ...minimalValidCV,
    experience: [
      {
        company: "Co B",
        title: "Role B",
        startDate: "Jan 2021",
        endDate: "Dec 2022",
      },
      {
        company: "Co A",
        title: "Role A",
        startDate: "Jan 2023",
        endDate: "Dec 2024",
      },
    ],
  });
  assert.equal(swappedExp.warnings.length, 1);
  assert.equal(
    swappedExp.warnings[0],
    "experience[0] is older than experience[1]; list items most recent first",
  );

  // Item with missing endDate (Present) sorts first
  const presentFirst = parseCv({
    ...minimalValidCV,
    experience: [
      { company: "Now", title: "Active", startDate: "Jan 2023" },
      {
        company: "Past",
        title: "Done",
        startDate: "Jan 2020",
        endDate: "Dec 2022",
      },
    ],
  });
  assert.equal(presentFirst.warnings.length, 0);

  const presentSecond = parseCv({
    ...minimalValidCV,
    experience: [
      {
        company: "Past",
        title: "Done",
        startDate: "Jan 2020",
        endDate: "Dec 2022",
      },
      { company: "Now", title: "Active", startDate: "Jan 2023" },
    ],
  });
  assert.equal(presentSecond.warnings.length, 1);
  assert.equal(
    presentSecond.warnings[0],
    "experience[0] is older than experience[1]; list items most recent first",
  );

  // Two Present items ordered by start (later start first)
  const twoPresentOrdered = parseCv({
    ...minimalValidCV,
    experience: [
      { company: "Newer Job", title: "Lead", startDate: "Jun 2023" },
      { company: "Older Job", title: "Dev", startDate: "Jan 2023" },
    ],
  });
  assert.equal(twoPresentOrdered.warnings.length, 0);

  const twoPresentSwapped = parseCv({
    ...minimalValidCV,
    experience: [
      { company: "Older Job", title: "Dev", startDate: "Jan 2023" },
      { company: "Newer Job", title: "Lead", startDate: "Jun 2023" },
    ],
  });
  assert.equal(twoPresentSwapped.warnings.length, 1);
  assert.equal(
    twoPresentSwapped.warnings[0],
    "experience[0] is older than experience[1]; list items most recent first",
  );

  // Equal ends are decided by start
  const equalEndsOrdered = parseCv({
    ...minimalValidCV,
    experience: [
      {
        company: "Co A",
        title: "Role A",
        startDate: "Jun 2023",
        endDate: "Dec 2023",
      },
      {
        company: "Co B",
        title: "Role B",
        startDate: "Jan 2023",
        endDate: "Dec 2023",
      },
    ],
  });
  assert.equal(equalEndsOrdered.warnings.length, 0);

  const equalEndsSwapped = parseCv({
    ...minimalValidCV,
    experience: [
      {
        company: "Co B",
        title: "Role B",
        startDate: "Jan 2023",
        endDate: "Dec 2023",
      },
      {
        company: "Co A",
        title: "Role A",
        startDate: "Jun 2023",
        endDate: "Dec 2023",
      },
    ],
  });
  assert.equal(equalEndsSwapped.warnings.length, 1);
  assert.equal(
    equalEndsSwapped.warnings[0],
    "experience[0] is older than experience[1]; list items most recent first",
  );

  // Year-only vs month dates that overlap give no warning
  const yearOverlap = parseCv({
    ...minimalValidCV,
    experience: [
      { company: "Co A", title: "Role A", startDate: "2024", endDate: "2024" },
      {
        company: "Co B",
        title: "Role B",
        startDate: "Jan 2024",
        endDate: "Jun 2024",
      },
    ],
  });
  assert.equal(yearOverlap.warnings.length, 0);

  // Projects out of date order give no warning
  const projectsOutOfOrder = parseCv({
    ...minimalValidCV,
    projects: [
      {
        title: "Old Project",
        description: "Important",
        startDate: "2019",
        endDate: "2020",
      },
      {
        title: "New Project",
        description: "Less important",
        startDate: "2024",
        endDate: "2025",
      },
    ],
  });
  assert.equal(projectsOutOfOrder.warnings.length, 0);

  // Certifications ordered by date
  const certsOrdered = parseCv({
    ...minimalValidCV,
    certifications: [
      { name: "Cert 2", issuer: "Org", date: "2024" },
      { name: "Cert 1", issuer: "Org", date: "2022" },
    ],
  });
  assert.equal(certsOrdered.warnings.length, 0);

  const certsSwapped = parseCv({
    ...minimalValidCV,
    certifications: [
      { name: "Cert 1", issuer: "Org", date: "2022" },
      { name: "Cert 2", issuer: "Org", date: "2024" },
    ],
  });
  assert.equal(certsSwapped.warnings.length, 1);
  assert.equal(
    certsSwapped.warnings[0],
    "certifications[0] is older than certifications[1]; list items most recent first",
  );
});

test("10. parseCvDate returns expected min and max for month and year inputs and undefined for invalid input", () => {
  const jan2025 = parseCvDate("Jan 2025");
  assert.deepEqual(jan2025, {
    min: 2025 * 12 + 0,
    max: 2025 * 12 + 0,
  });

  const year2025 = parseCvDate("2025");
  assert.deepEqual(year2025, {
    min: 2025 * 12 + 0,
    max: 2025 * 12 + 11,
  });

  assert.equal(parseCvDate("invalid"), undefined);
  assert.equal(parseCvDate(""), undefined);
  assert.equal(parseCvDate("January 2025"), undefined);
});
