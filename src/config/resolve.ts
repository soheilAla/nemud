import fs from "node:fs";
import path from "node:path";
import {
  ALL_BODY_SECTIONS,
  type BodySectionKey,
  type ResolvedSiteConfig,
  type SiteConfig,
  TOGGLEABLE_SECTIONS,
  type ToggleableSectionKey,
} from "../types/site.ts";

export { ALL_BODY_SECTIONS, TOGGLEABLE_SECTIONS };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateSiteConfig(
  raw: unknown,
  source: string = "site.json",
): SiteConfig {
  if (raw === undefined || raw === null) {
    return {};
  }
  if (!isRecord(raw)) {
    throw new Error(`${source}: Configuration must be an object.`);
  }

  const allowedKeys = new Set([
    "showPortrait",
    "sectionOrder",
    "sectionVisibility",
  ]);
  for (const key of Object.keys(raw)) {
    if (!allowedKeys.has(key)) {
      throw new Error(
        `${source}: Unrecognized configuration key "${key}". Users cannot add custom sections or titles; only showPortrait, sectionOrder, and sectionVisibility are supported.`,
      );
    }
  }

  const config: SiteConfig = {};

  if (raw.showPortrait !== undefined) {
    if (typeof raw.showPortrait !== "boolean") {
      throw new Error(`${source}: "showPortrait" must be a boolean.`);
    }
    config.showPortrait = raw.showPortrait;
  }

  if (raw.sectionOrder !== undefined) {
    if (!Array.isArray(raw.sectionOrder)) {
      throw new Error(
        `${source}: "sectionOrder" must be an array of predefined section keys.`,
      );
    }
    for (const key of raw.sectionOrder) {
      if (
        typeof key !== "string" ||
        !ALL_BODY_SECTIONS.includes(key as BodySectionKey)
      ) {
        throw new Error(
          `${source}: "sectionOrder" contains invalid section "${key}". Only predefined sections are allowed: ${ALL_BODY_SECTIONS.join(", ")}.`,
        );
      }
    }
    config.sectionOrder = raw.sectionOrder as BodySectionKey[];
  }

  if (raw.sectionVisibility !== undefined) {
    if (!isRecord(raw.sectionVisibility)) {
      throw new Error(`${source}: "sectionVisibility" must be an object.`);
    }
    for (const [key, val] of Object.entries(raw.sectionVisibility)) {
      if (!TOGGLEABLE_SECTIONS.includes(key as ToggleableSectionKey)) {
        throw new Error(
          `${source}: "sectionVisibility" contains invalid section "${key}". Only toggleable sections are allowed: ${TOGGLEABLE_SECTIONS.join(", ")}.`,
        );
      }
      if (typeof val !== "boolean") {
        throw new Error(
          `${source}: "sectionVisibility.${key}" must be a boolean.`,
        );
      }
    }
    config.sectionVisibility = raw.sectionVisibility as Partial<
      Record<ToggleableSectionKey, boolean>
    >;
  }

  return config;
}

export function resolveSiteConfig(
  config?: SiteConfig | null,
): ResolvedSiteConfig {
  const safeConfig = config ?? {};
  const rawOrder = safeConfig.sectionOrder ?? ALL_BODY_SECTIONS;
  const seen = new Set<BodySectionKey>();
  const sectionOrder: BodySectionKey[] = [];

  for (const key of rawOrder) {
    if (ALL_BODY_SECTIONS.includes(key) && !seen.has(key)) {
      seen.add(key);
      sectionOrder.push(key);
    }
  }

  for (const key of ALL_BODY_SECTIONS) {
    if (!seen.has(key)) {
      seen.add(key);
      sectionOrder.push(key);
    }
  }

  const sectionVisibility = {} as Record<BodySectionKey, boolean>;
  for (const key of ALL_BODY_SECTIONS) {
    if (key === "skills") {
      sectionVisibility[key] = true;
    } else {
      sectionVisibility[key] =
        safeConfig.sectionVisibility?.[key as ToggleableSectionKey] !== false;
    }
  }

  const showPortrait = safeConfig.showPortrait !== false;

  return {
    showPortrait,
    sectionOrder,
    sectionVisibility,
  };
}

export function loadSiteConfig(
  filePath: string = path.resolve(process.cwd(), "config/site.json"),
): SiteConfig {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    throw new Error(
      `Failed to read site configuration at "${filePath}": ${(err as Error).message}`,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    throw new Error(
      `Failed to parse site configuration at "${filePath}": ${(err as Error).message}`,
    );
  }

  return validateSiteConfig(parsed, filePath);
}
