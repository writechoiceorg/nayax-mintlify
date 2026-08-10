#!/usr/bin/env node
// Sentence-case sweep for docs/ pages.
//
// Converts `##`/`###` headings and <Step|Card|Accordion title="..."> text to
// sentence case, per the writer/reviewer skill rule (frontmatter `title` is
// the only Title Case exception and is never touched by this script).
//
// Usage:
//   node tools/sentence-case/fix-heading-case.mjs             # dry run, report only
//   node tools/sentence-case/fix-heading-case.mjs --apply      # also rewrite high-confidence matches
//
// Scope: only docs/ pages that appear in docs.json's "en" navigation.
// Report: .claude/sentence-case-report.md (gitignored).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { STOPWORDS, PHRASES, WORDS, ALWAYS_CAPS_RE } from "./glossary.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const DOCS_JSON = path.join(REPO_ROOT, "docs.json");
const REPORT_PATH = path.join(REPO_ROOT, ".claude", "sentence-case-report.md");

const APPLY = process.argv.includes("--apply");

function escapeRegExp(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---------- page discovery ----------

function getInScopeFiles() {
  const docsJson = JSON.parse(fs.readFileSync(DOCS_JSON, "utf8"));
  const en = docsJson.navigation.languages.find((entry) => entry.language === "en");
  const pages = new Set();

  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node === "string") {
      pages.add(node);
      return;
    }
    if (node && typeof node === "object") {
      for (const key of ["pages", "tabs", "groups", "anchors", "dropdowns", "menu"]) {
        if (node[key]) walk(node[key]);
      }
    }
  };
  walk(en.tabs);

  return [...pages]
    .filter((slug) => slug.startsWith("docs/"))
    .map((slug) => path.join(REPO_ROOT, slug + ".mdx"))
    .filter((filePath) => fs.existsSync(filePath));
}

// ---------- casing engine ----------

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function isAcronym(word) {
  const letters = word.replace(/[^A-Za-z]/g, "");
  return letters.length >= 2 && word === word.toUpperCase() && /[A-Z]/.test(word);
}

function hasInternalCap(word) {
  return /[A-Z]/.test(word.slice(1));
}

const SORTED_PHRASES = PHRASES.slice().sort((a, b) => b.length - a.length);

function placeholderToken(idx) {
  return "ZzScpZz" + idx + "ZzEndZz";
}

const PLACEHOLDER_RE = /ZzScpZz(\d+)ZzEndZz/g;

// Returns { text, lowConfidence }. lowConfidence is true when at least one
// word looked like a proper noun (capitalized, not the first word) that no
// rule could explain -- callers should leave those headings untouched in
// --apply mode and surface them in the report instead.
function sentenceCase(text) {
  let lowConfidence = false;
  const placeholders = [];
  let protectedText = text;

  for (const phrase of SORTED_PHRASES) {
    const phraseRe = new RegExp("\\b" + escapeRegExp(phrase) + "\\b", "gi");
    protectedText = protectedText.replace(phraseRe, function () {
      const idx = placeholders.length;
      placeholders.push(phrase);
      return placeholderToken(idx);
    });
  }

  const tokens = protectedText.split(/([\s\-/&,:;()?!.]+)/);
  let seenFirstWord = false;

  const outTokens = tokens.map(function (tok) {
    if (tok === "" || /^[\s\-/&,:;()?!.]+$/.test(tok)) {
      return tok;
    }
    if (/^ZzScpZz\d+ZzEndZz$/.test(tok)) {
      // Protected phrase occupies the "first word" slot when it's at the
      // start, so a later real word doesn't also get treated as first.
      seenFirstWord = true;
      return tok;
    }

    const isFirst = !seenFirstWord;
    seenFirstWord = true;
    const lower = tok.toLowerCase();

    if (isAcronym(tok)) return tok;
    if (hasInternalCap(tok)) return tok;
    if (ALWAYS_CAPS_RE.test(lower)) return tok.charAt(0).toUpperCase() + tok.slice(1);
    if (WORDS.has(lower)) {
      const canon = WORDS.get(lower);
      return isFirst ? capitalize(canon) : canon;
    }
    // Possessive of a known proper noun, e.g. "Nayax's" -> keep canonical + 's.
    if (lower.endsWith("'s") && WORDS.has(lower.slice(0, -2))) {
      const canon = WORDS.get(lower.slice(0, -2));
      const withApostrophe = canon + "'s";
      return isFirst ? capitalize(withApostrophe) : withApostrophe;
    }
    if (isFirst) return capitalize(lower);
    if (STOPWORDS.has(lower)) return lower;
    // A short (<=2 letter) capitalized word we can't otherwise explain is
    // more likely to be an unlisted abbreviation than an ordinary word --
    // flag it rather than guess. Anything longer defaults to lowercase,
    // matching standard sentence-case style; the docs/ corpus was manually
    // reviewed while building this glossary and known proper nouns are
    // already listed above.
    if (/^[A-Z]/.test(tok) && tok.replace(/[^A-Za-z]/g, "").length <= 2) {
      lowConfidence = true;
      return tok;
    }
    return lower;
  });

  let result = outTokens.join("");
  result = result.replace(PLACEHOLDER_RE, function (_, idx) {
    return placeholders[Number(idx)];
  });
  return { text: result, lowConfidence: lowConfidence };
}

// ---------- fenced-code-block ranges (skip matches inside these) ----------

function fencedRanges(text) {
  const ranges = [];
  const fenceRe = /```[\s\S]*?```/g;
  let match;
  while ((match = fenceRe.exec(text))) {
    ranges.push([match.index, match.index + match[0].length]);
  }
  return ranges;
}

function insideAny(ranges, pos) {
  return ranges.some(function (range) {
    return pos >= range[0] && pos < range[1];
  });
}

// ---------- per-file processing ----------

function lineNoAt(text, offset) {
  return text.slice(0, offset).split("\n").length;
}

function findMatches(text) {
  const fenced = fencedRanges(text);
  const matches = [];

  const headingRe = /^(#{2,3})([ \t]+)(.*)$/gm;
  let m;
  while ((m = headingRe.exec(text))) {
    if (insideAny(fenced, m.index)) continue;
    const hashes = m[1];
    const sp = m[2];
    const headingText = m[3];
    const textStart = m.index + hashes.length + sp.length;
    matches.push({
      kind: "H" + hashes.length,
      start: textStart,
      end: textStart + headingText.length,
      original: headingText,
    });
  }

  const jsxRe = /<(Step|Card|Accordion)\b[^>]*?\btitle="([^"]*)"/g;
  while ((m = jsxRe.exec(text))) {
    if (insideAny(fenced, m.index)) continue;
    const tag = m[1];
    const titleText = m[2];
    const full = m[0];
    const titleStart = m.index + full.lastIndexOf(titleText);
    matches.push({
      kind: tag,
      start: titleStart,
      end: titleStart + titleText.length,
      original: titleText,
    });
  }

  matches.sort(function (a, b) {
    return a.start - b.start;
  });
  return matches;
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  const matches = findMatches(original);
  if (matches.length === 0) return null;

  const applied = [];
  const flagged = [];
  let cursor = 0;
  let out = "";

  for (const match of matches) {
    const result = sentenceCase(match.original);
    const proposed = result.text;
    const lowConfidence = result.lowConfidence;
    out += original.slice(cursor, match.start);

    if (proposed === match.original) {
      out += match.original; // no change needed
    } else if (lowConfidence) {
      out += match.original; // leave untouched, report only
      flagged.push({ line: lineNoAt(original, match.start), kind: match.kind, original: match.original, proposed: proposed });
    } else {
      out += proposed;
      applied.push({ line: lineNoAt(original, match.start), kind: match.kind, original: match.original, proposed: proposed });
    }
    cursor = match.end;
  }
  out += original.slice(cursor);

  if (APPLY && applied.length > 0) {
    fs.writeFileSync(filePath, out, "utf8");
  }

  if (applied.length === 0 && flagged.length === 0) return null;
  return { filePath: filePath, applied: applied, flagged: flagged };
}

// ---------- main ----------

function relPath(p) {
  return path.relative(REPO_ROOT, p).replace(/\\/g, "/");
}

function main() {
  const files = getInScopeFiles();
  const results = files.map(processFile).filter(Boolean);

  const totalApplied = results.reduce(function (n, r) { return n + r.applied.length; }, 0);
  const totalFlagged = results.reduce(function (n, r) { return n + r.flagged.length; }, 0);

  const lines = [];
  lines.push("# Sentence-case report");
  lines.push("");
  lines.push("Mode: " + (APPLY ? "--apply (files rewritten)" : "--dry-run (no files changed)"));
  lines.push("Files scanned: " + files.length);
  lines.push("Files with changes or flags: " + results.length);
  lines.push("Headings/titles " + (APPLY ? "fixed" : "that would be fixed") + ": " + totalApplied);
  lines.push("Headings/titles needing manual review: " + totalFlagged);
  lines.push("");

  if (totalApplied > 0) {
    lines.push("## " + (APPLY ? "Applied" : "Would apply") + " (high confidence)");
    lines.push("");
    for (const r of results) {
      if (r.applied.length === 0) continue;
      lines.push("### " + relPath(r.filePath));
      for (const c of r.applied) {
        lines.push('- L' + c.line + ' [' + c.kind + '] "' + c.original + '" -> "' + c.proposed + '"');
      }
      lines.push("");
    }
  }

  if (totalFlagged > 0) {
    lines.push("## Needs manual review (unrecognized capitalized word)");
    lines.push("");
    for (const r of results) {
      if (r.flagged.length === 0) continue;
      lines.push("### " + relPath(r.filePath));
      for (const c of r.flagged) {
        lines.push('- L' + c.line + ' [' + c.kind + '] "' + c.original + '" -> proposed "' + c.proposed + '" (unconfirmed)');
      }
      lines.push("");
    }
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, lines.join("\n"), "utf8");

  console.log("Scanned " + files.length + " in-scope files.");
  console.log((APPLY ? "Applied" : "Would apply") + ": " + totalApplied + " headings/titles across " + results.filter(function (r) { return r.applied.length; }).length + " files.");
  console.log("Flagged for manual review: " + totalFlagged + " headings/titles across " + results.filter(function (r) { return r.flagged.length; }).length + " files.");
  console.log("Report written to " + relPath(REPORT_PATH));
}

main();
