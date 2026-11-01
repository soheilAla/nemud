import assert from "node:assert/strict";
import { test } from "node:test";
import { parseBoldText } from "../src/lib/format-text.ts";

test("parseBoldText: handles empty, undefined, or null input", () => {
  assert.deepEqual(parseBoldText(""), []);
  assert.deepEqual(parseBoldText(undefined), []);
  assert.deepEqual(parseBoldText(null), []);
});

test("parseBoldText: preserves plain text without formatting", () => {
  const result = parseBoldText("Plain text with no special markers.");
  assert.deepEqual(result, [
    { text: "Plain text with no special markers.", bold: false },
  ]);
});

test("parseBoldText: parses single and multiple bold phrases", () => {
  const single = parseBoldText("Lead developer on **FastAPI** project.");
  assert.deepEqual(single, [
    { text: "Lead developer on ", bold: false },
    { text: "FastAPI", bold: true },
    { text: " project.", bold: false },
  ]);

  const multiple = parseBoldText(
    "Reduced latency from **480 ms** to **190 ms** using **PostgreSQL** indexes.",
  );
  assert.deepEqual(multiple, [
    { text: "Reduced latency from ", bold: false },
    { text: "480 ms", bold: true },
    { text: " to ", bold: false },
    { text: "190 ms", bold: true },
    { text: " using ", bold: false },
    { text: "PostgreSQL", bold: true },
    { text: " indexes.", bold: false },
  ]);
});

test("parseBoldText: handles bold at boundaries", () => {
  const atStart = parseBoldText("**Senior Engineer** with 5 years experience.");
  assert.deepEqual(atStart, [
    { text: "Senior Engineer", bold: true },
    { text: " with 5 years experience.", bold: false },
  ]);

  const atEnd = parseBoldText("Built service with **Docker**");
  assert.deepEqual(atEnd, [
    { text: "Built service with ", bold: false },
    { text: "Docker", bold: true },
  ]);

  const entireString = parseBoldText("**Everything is bold**");
  assert.deepEqual(entireString, [{ text: "Everything is bold", bold: true }]);
});

test("parseBoldText: leaves unmatched ** markers as plain text", () => {
  const unclosed = parseBoldText("Text with **unclosed marker here.");
  assert.deepEqual(unclosed, [
    { text: "Text with **unclosed marker here.", bold: false },
  ]);

  const unopened = parseBoldText("Text with unopened** marker here.");
  assert.deepEqual(unopened, [
    { text: "Text with unopened** marker here.", bold: false },
  ]);

  const singleMarker = parseBoldText("**");
  assert.deepEqual(singleMarker, [{ text: "**", bold: false }]);

  const fourMarkers = parseBoldText("Empty **** asterisks");
  assert.deepEqual(fourMarkers, [
    { text: "Empty **** asterisks", bold: false },
  ]);
});

test("parseBoldText: does not support other Markdown features", () => {
  const withOtherMarkdown = parseBoldText(
    "*Italic text*, # Heading, and [Link](https://example.com) with **Bold**.",
  );
  assert.deepEqual(withOtherMarkdown, [
    {
      text: "*Italic text*, # Heading, and [Link](https://example.com) with ",
      bold: false,
    },
    { text: "Bold", bold: true },
    { text: ".", bold: false },
  ]);
});

test("parseBoldText: preserves punctuation and numbers inside bold", () => {
  const complex = parseBoldText(
    "Worked on **C++ / C#**, **$100k+**, and **99.9%** SLA.",
  );
  assert.deepEqual(complex, [
    { text: "Worked on ", bold: false },
    { text: "C++ / C#", bold: true },
    { text: ", ", bold: false },
    { text: "$100k+", bold: true },
    { text: ", and ", bold: false },
    { text: "99.9%", bold: true },
    { text: " SLA.", bold: false },
  ]);
});
