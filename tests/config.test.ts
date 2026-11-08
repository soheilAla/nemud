import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  ALL_BODY_SECTIONS,
  loadSiteConfig,
  resolveSiteConfig,
  validateSiteConfig,
} from "../src/config/resolve.ts";
import type { CV } from "../src/types/cv.ts";
import type { BodySectionKey, SiteConfig } from "../src/types/site.ts";

test("resolveSiteConfig: applies safe defaults for minimal config", () => {
  const resolved = resolveSiteConfig({});

  assert.equal(resolved.showPortrait, true);
  assert.equal(resolved.sectionOrder.length, ALL_BODY_SECTIONS.length);
  for (const key of ALL_BODY_SECTIONS) {
    assert.equal(resolved.sectionVisibility[key], true);
  }
});

test("resolveSiteConfig: deduplicates sectionOrder and appends missing predefined sections", () => {
  const customConfig = {
    sectionOrder: ["experience", "experience", "invalid-key", "skills"],
  } as unknown as SiteConfig;

  const resolved = resolveSiteConfig(customConfig);

  assert.equal(resolved.sectionOrder[0], "experience");
  assert.equal(resolved.sectionOrder[1], "skills");
  assert.ok(!resolved.sectionOrder.includes("invalid-key" as BodySectionKey));

  const uniqueKeys = new Set(resolved.sectionOrder);
  assert.equal(uniqueKeys.size, ALL_BODY_SECTIONS.length);
});

test("resolveSiteConfig: respects explicit sectionVisibility: false and showPortrait: false", () => {
  const resolved = resolveSiteConfig({
    showPortrait: false,
    sectionVisibility: {
      certifications: false,
    },
  });

  assert.equal(resolved.showPortrait, false);
  assert.equal(resolved.sectionVisibility.certifications, false);
  assert.equal(resolved.sectionVisibility.experience, true);
});

test("validateSiteConfig: strictly rejects custom sections and unknown keys", () => {
  // Reject removed sectionTitles or unknown properties
  assert.throws(
    () => validateSiteConfig({ sectionTitles: { summary: "About" } }),
    /Unrecognized configuration key "sectionTitles"/,
  );

  // Reject invalid section names in sectionOrder
  assert.throws(
    () => validateSiteConfig({ sectionOrder: ["customSection"] }),
    /contains invalid section "customSection"/,
  );

  // Reject invalid section names in sectionVisibility
  assert.throws(
    () => validateSiteConfig({ sectionVisibility: { hobbies: true } }),
    /contains invalid section "hobbies"/,
  );

  // Reject summary in sectionVisibility and sectionOrder
  assert.throws(
    () => validateSiteConfig({ sectionVisibility: { summary: true } }),
    /contains invalid section "summary"/,
  );
  assert.throws(
    () => validateSiteConfig({ sectionOrder: ["summary"] }),
    /contains invalid section "summary"/,
  );

  // Reject skills in sectionVisibility
  assert.throws(
    () => validateSiteConfig({ sectionVisibility: { skills: false } }),
    /contains invalid section "skills"/,
  );
  assert.throws(
    () => validateSiteConfig({ sectionVisibility: { skills: true } }),
    /contains invalid section "skills"/,
  );

  // Reject wrong types
  assert.throws(
    () => validateSiteConfig({ showPortrait: "yes" }),
    /"showPortrait" must be a boolean/,
  );
  assert.throws(
    () => validateSiteConfig({ $schema: 123 }),
    /"\$schema" must be a string/,
  );
  assert.doesNotThrow(() =>
    validateSiteConfig({ $schema: "./site.schema.json" }),
  );
});

test("loadSiteConfig: safely handles missing optional file and invalid JSON", () => {
  const missingPath = path.join(os.tmpdir(), "missing-site-test.json");
  assert.deepEqual(loadSiteConfig(missingPath), {});

  const badJsonPath = path.join(os.tmpdir(), "bad-site-test.json");
  fs.writeFileSync(badJsonPath, "{ invalid json }");
  try {
    assert.throws(
      () => loadSiteConfig(badJsonPath),
      /Failed to parse site configuration/,
    );
  } finally {
    fs.unlinkSync(badJsonPath);
  }
});

test("empty section detection: empty arrays or whitespace strings are not rendered", () => {
  const sampleCV: CV = {
    basics: {
      name: "Test Candidate",
      headline: "Tester",
      email: "test@example.com",
      phone: "+1234567890",
      location: "Remote",
      timeZone: "UTC+00:00",
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
    return Array.isArray(data) ? data.length > 0 : true;
  }

  assert.equal(isSectionNonEmpty("experience", sampleCV), false);
  assert.equal(isSectionNonEmpty("publications", sampleCV), false);
  assert.equal(isSectionNonEmpty("projects", sampleCV), true);
});
