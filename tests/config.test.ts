import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveSiteConfig } from "../src/config/resolve.ts";
import type { CV } from "../src/types/cv.ts";
import type { BodySectionKey, SiteConfig } from "../src/types/site.ts";

test("resolveSiteConfig: applies safe defaults for minimal config", () => {
  const minimalConfig: SiteConfig = {};

  const resolved = resolveSiteConfig(minimalConfig);

  assert.equal(resolved.showPortrait, true);
  assert.equal(resolved.sectionTitles.summary, "Summary");
  assert.equal(resolved.sectionTitles.publications, "Research & Publications");
  assert.equal(resolved.sectionVisibility.summary, true);
  assert.equal(resolved.sectionVisibility.publications, true);
  assert.ok(resolved.sectionOrder.length >= 8);
});

test("resolveSiteConfig: deduplicates sectionOrder and filters out invalid keys", () => {
  const duplicateConfig = {
    sectionOrder: [
      "experience",
      "experience",
      "invalid-key",
      "skills",
      "experience",
    ],
  } as unknown as SiteConfig;

  const resolved = resolveSiteConfig(duplicateConfig);

  assert.equal(resolved.sectionOrder[0], "experience");
  assert.equal(resolved.sectionOrder[1], "skills");
  assert.ok(!resolved.sectionOrder.includes("invalid-key" as BodySectionKey));

  const uniqueKeys = new Set(resolved.sectionOrder);
  assert.equal(uniqueKeys.size, resolved.sectionOrder.length);
});

test("resolveSiteConfig: respects user section title overrides", () => {
  const configWithOverride: SiteConfig = {
    sectionTitles: {
      summary: "Executive Profile",
      publications: "Selected Papers",
    },
  };

  const resolved = resolveSiteConfig(configWithOverride);

  assert.equal(resolved.sectionTitles.summary, "Executive Profile");
  assert.equal(resolved.sectionTitles.publications, "Selected Papers");
  assert.equal(resolved.sectionTitles.experience, "Experience");
});

test("resolveSiteConfig: respects explicit sectionVisibility: false", () => {
  const configWithHidden: SiteConfig = {
    sectionVisibility: {
      certifications: false,
      summary: false,
    },
  };

  const resolved = resolveSiteConfig(configWithHidden);

  assert.equal(resolved.sectionVisibility.certifications, false);
  assert.equal(resolved.sectionVisibility.summary, false);
  assert.equal(resolved.sectionVisibility.experience, true);
  assert.equal(resolved.sectionVisibility.publications, true);
});

test("resolveSiteConfig: respects explicit showPortrait: false", () => {
  const configWithoutPortrait: SiteConfig = {
    showPortrait: false,
  };

  const resolved = resolveSiteConfig(configWithoutPortrait);
  assert.equal(resolved.showPortrait, false);
});

test("empty section detection: empty arrays or empty strings are not rendered", () => {
  const sampleCV: CV = {
    basics: {
      name: "Test Candidate",
      headline: "Tester",
      email: "test@example.com",
      phone: "+1234567890",
      location: "Remote",
    },
    summary: "   ",
    experience: [],
    publications: undefined,
    projects: [
      {
        title: "Valid Project",
        description: "Working",
        startDate: "2024",
      },
    ],
  };

  function isSectionNonEmpty(key: BodySectionKey, cv: CV): boolean {
    const data = cv[key];
    if (!data) return false;
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === "string") return data.trim().length > 0;
    return true;
  }

  assert.equal(isSectionNonEmpty("summary", sampleCV), false);
  assert.equal(isSectionNonEmpty("experience", sampleCV), false);
  assert.equal(isSectionNonEmpty("publications", sampleCV), false);
  assert.equal(isSectionNonEmpty("projects", sampleCV), true);
});
