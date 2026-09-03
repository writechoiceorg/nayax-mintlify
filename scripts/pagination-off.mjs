#!/usr/bin/env node
// Adds `hideFooterPagination: true` to:
//   1. the frontmatter of .mdx files selected by scripts/pagination-off.txt
//      (default mode), or
//   2. every operation's `x-mint.metadata` block in the OpenAPI-generated
//      reference pages, via --openapi (see OPENAPI_TARGETS below).
//
// Usage:
//   node scripts/pagination-off.mjs --dry-run              # mdx pass, preview
//   node scripts/pagination-off.mjs                        # mdx pass, write
//   node scripts/pagination-off.mjs --openapi --dry-run    # openapi pass, preview
//   node scripts/pagination-off.mjs --openapi              # openapi pass, write
//
// Pattern syntax (one per line in pagination-off.txt):
//   # comment                          -> ignored
//   (blank line)                       -> ignored
//   some/dir/**                        -> every .mdx file recursively under some/dir
//   some/path/without/extension        -> exactly one file, some/path/without/extension.mdx
//   index                              -> index.mdx at repo root
//
// The --openapi pass never re-serializes the YAML documents (the `yaml`
// library's stringifier rewraps long folded-scalar descriptions and
// normalizes line endings, which would blow up the diff of these
// hand-maintained specs). Instead it parses each file only to find the
// exact byte offset where each operation's mapping ends, then splices the
// new `x-mint` block into the original text at that offset. Everything
// else in the file is byte-for-byte untouched.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as YAML from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const PATTERNS_FILE = path.join(__dirname, "pagination-off.txt");
const FIELD_NAME = "hideFooterPagination";
const FIELD_LINE = `${FIELD_NAME}: true`;
const SUSPICIOUS_THRESHOLD = 15;

const DRY_RUN = process.argv.includes("--dry-run");
const RUN_OPENAPI = process.argv.includes("--openapi");

// Deliberately excludes openapi/lynx.yaml, openapi/e-receipt.yaml and
// openapi/ecom.yaml: only cortina.yaml and spark.yaml are in scope for
// this pass.
const OPENAPI_TARGETS = ["openapi/cortina.yaml", "openapi/spark.yaml"];
const HTTP_METHODS = new Set([
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
]);

function readPatterns() {
  const raw = fs.readFileSync(PATTERNS_FILE, "utf8");
  const patterns = [];
  raw.split(/\r?\n/).forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    patterns.push({ pattern: trimmed, lineNo: idx + 1 });
  });
  return patterns;
}

function findMdxRecursive(dirAbs) {
  const results = [];
  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
        results.push(full);
      }
    }
  }
  walk(dirAbs);
  return results;
}

// Resolves one pattern line to a list of absolute file paths.
// Returns { files, note } where note explains anything worth flagging
// (e.g. the bare path resolved to a directory instead of a single file).
function resolvePattern(pattern) {
  if (pattern.endsWith("/**")) {
    const dirRel = pattern.slice(0, -"/**".length);
    const dirAbs = path.join(REPO_ROOT, dirRel);
    if (!fs.existsSync(dirAbs) || !fs.statSync(dirAbs).isDirectory()) {
      return { files: [], note: "directory does not exist" };
    }
    return { files: findMdxRecursive(dirAbs), note: null };
  }

  // Bare path: expect exactly one leaf page.
  const asMdx = path.join(REPO_ROOT, `${pattern}.mdx`);
  if (fs.existsSync(asMdx) && fs.statSync(asMdx).isFile()) {
    return { files: [asMdx], note: null };
  }

  const asIs = path.join(REPO_ROOT, pattern);
  if (fs.existsSync(asIs) && fs.statSync(asIs).isFile()) {
    return { files: [asIs], note: null };
  }
  if (fs.existsSync(asIs) && fs.statSync(asIs).isDirectory()) {
    return {
      files: findMdxRecursive(asIs),
      note: "pattern had no /** but resolved to a directory; expanded recursively",
    };
  }

  return { files: [], note: "no matching file or directory" };
}

const BOM = "﻿";

// Splits file content into { frontmatter, body, hasFrontmatter, hasBOM }.
// frontmatter is the raw text between the --- delimiters, without the delimiters.
function splitFrontmatter(rawContent) {
  const hasBOM = rawContent.startsWith(BOM);
  const content = hasBOM ? rawContent.slice(BOM.length) : rawContent;
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { hasFrontmatter: false, hasBOM };
  const frontmatter = match[1];
  const body = content.slice(match[0].length);
  const usesCRLF = /\r\n/.test(match[0]);
  return { hasFrontmatter: true, frontmatter, body, usesCRLF, hasBOM };
}

function alreadyHasField(frontmatter) {
  return new RegExp(`^${FIELD_NAME}\\s*:`, "m").test(frontmatter);
}

function addField(frontmatter, usesCRLF) {
  const nl = usesCRLF ? "\r\n" : "\n";
  const trimmed = frontmatter.replace(/\r?\n$/, "");
  return `${trimmed}${nl}${FIELD_LINE}`;
}

function rebuildFile(frontmatterBlock, body, usesCRLF, hasBOM) {
  const nl = usesCRLF ? "\r\n" : "\n";
  const prefix = hasBOM ? BOM : "";
  return `${prefix}---${nl}${frontmatterBlock}${nl}---${nl}${body}`;
}

function runMdxPass() {
  const patterns = readPatterns();

  const zeroMatchPatterns = [];
  const suspiciousPatterns = [];
  const noteworthyPatterns = [];
  const fileToPatterns = new Map(); // absPath -> [patterns that matched it]

  for (const { pattern, lineNo } of patterns) {
    const { files, note } = resolvePattern(pattern);
    if (files.length === 0) {
      zeroMatchPatterns.push({ pattern, lineNo, note });
    } else if (files.length > SUSPICIOUS_THRESHOLD) {
      suspiciousPatterns.push({ pattern, lineNo, count: files.length });
    }
    if (note && files.length > 0) {
      noteworthyPatterns.push({ pattern, lineNo, note, count: files.length });
    }
    for (const f of files) {
      if (!fileToPatterns.has(f)) fileToPatterns.set(f, []);
      fileToPatterns.get(f).push(pattern);
    }
  }

  const allFiles = [...fileToPatterns.keys()].sort();

  const toChange = [];
  const alreadySet = [];
  const noFrontmatter = [];

  for (const absPath of allFiles) {
    const relPath = path.relative(REPO_ROOT, absPath).replace(/\\/g, "/");
    const content = fs.readFileSync(absPath, "utf8");
    const parsed = splitFrontmatter(content);
    if (!parsed.hasFrontmatter) {
      noFrontmatter.push(relPath);
      continue;
    }
    if (alreadyHasField(parsed.frontmatter)) {
      alreadySet.push(relPath);
      continue;
    }
    const newFrontmatter = addField(parsed.frontmatter, parsed.usesCRLF);
    toChange.push({
      absPath,
      relPath,
      before: parsed.frontmatter,
      after: newFrontmatter,
      body: parsed.body,
      usesCRLF: parsed.usesCRLF,
      hasBOM: parsed.hasBOM,
    });
  }

  // ---- Report ----
  console.log(`Patterns read: ${patterns.length}`);
  console.log(`Unique files matched: ${allFiles.length}`);
  console.log(`Already has ${FIELD_NAME}: ${alreadySet.length} (will be skipped)`);
  console.log(`No frontmatter block found: ${noFrontmatter.length}`);
  console.log(`Files that would change: ${toChange.length}`);
  console.log("");

  if (zeroMatchPatterns.length) {
    console.log(`Patterns matching ZERO files (${zeroMatchPatterns.length}):`);
    for (const p of zeroMatchPatterns) {
      console.log(`  line ${p.lineNo}: ${p.pattern}  (${p.note})`);
    }
    console.log("");
  } else {
    console.log("No patterns matched zero files.");
    console.log("");
  }

  if (suspiciousPatterns.length) {
    console.log(
      `Patterns matching MORE THAN ${SUSPICIOUS_THRESHOLD} files (${suspiciousPatterns.length}):`
    );
    for (const p of suspiciousPatterns) {
      console.log(`  line ${p.lineNo}: ${p.pattern}  -> ${p.count} files`);
    }
    console.log("");
  } else {
    console.log(`No patterns matched more than ${SUSPICIOUS_THRESHOLD} files.`);
    console.log("");
  }

  if (noteworthyPatterns.length) {
    console.log("Patterns worth double-checking:");
    for (const p of noteworthyPatterns) {
      console.log(`  line ${p.lineNo}: ${p.pattern}  -> ${p.note} (${p.count} files)`);
    }
    console.log("");
  }

  if (noFrontmatter.length) {
    console.log("Files with NO frontmatter block (skipped, not modified):");
    for (const f of noFrontmatter) console.log(`  ${f}`);
    console.log("");
  }

  if (DRY_RUN) {
    console.log(`--- DRY RUN: sample before/after (up to 3 of ${toChange.length}) ---`);
    for (const sample of toChange.slice(0, 3)) {
      console.log(`\nFile: ${sample.relPath}`);
      console.log("BEFORE:");
      console.log("---\n" + sample.before + "\n---");
      console.log("AFTER:");
      console.log("---\n" + sample.after + "\n---");
    }
    console.log(`\nDry run complete. No files were modified.`);
    return;
  }

  for (const change of toChange) {
    const newContent = rebuildFile(change.after, change.body, change.usesCRLF, change.hasBOM);
    fs.writeFileSync(change.absPath, newContent, "utf8");
  }
  console.log(`Done. Modified ${toChange.length} file(s).`);
}

// ---------------------------------------------------------------------
// OpenAPI pass (--openapi)
// ---------------------------------------------------------------------

// Column (number of leading spaces) of the line containing `offset`.
function indentOf(text, offset) {
  const lineStart = text.lastIndexOf("\n", offset - 1) + 1;
  let i = lineStart;
  while (text[i] === " ") i++;
  return i - lineStart;
}

// A YAMLMap has a real `.items` array; a scalar, null, or flow-empty `{}`
// node does not (or has one that isn't usable the way we need).
function isMap(node) {
  return !!node && Array.isArray(node.items);
}

// Indent (in spaces) a new key should use to become the last child of a
// block mapping, given that mapping's own YAMLMap node.
function childIndentOf(text, mapNode, parentPairKeyRange) {
  if (mapNode.items.length > 0) {
    const lastItem = mapNode.items[mapNode.items.length - 1];
    return indentOf(text, lastItem.key.range[0]);
  }
  // Empty map (e.g. `metadata: {}` written as a bare `metadata:` with no
  // children yet) - go one step deeper than the parent key itself.
  return indentOf(text, parentPairKeyRange[0]) + 2;
}

// Walks paths.*.<method> and, for one file, classifies every operation into:
//   - inserts:   no x-mint at all -> splice a full x-mint/metadata block
//   - merges:    x-mint exists, metadata missing or lacks the field ->
//                splice just the missing piece in, preserving everything
//                already there
//   - alreadySet: x-mint.metadata.hideFooterPagination already true -> skip
//   - anomalies: x-mint or metadata isn't a plain mapping -> skip, flag for
//                manual review (never auto-edited)
function collectOpenApiEdits(relPath, text, usesCRLF) {
  const nl = usesCRLF ? "\r\n" : "\n";
  const doc = YAML.parseDocument(text);
  const pathsNode = doc.get("paths", true);

  const inserts = [];
  const merges = [];
  const alreadySet = [];
  const anomalies = [];

  if (!pathsNode || !pathsNode.items) {
    return { relPath, totalOps: 0, inserts, merges, alreadySet, anomalies };
  }

  for (const pathItem of pathsNode.items) {
    const pathKey = String(pathItem.key.value);
    const pathValue = pathItem.value;
    if (!pathValue || !pathValue.items) continue;

    for (const opItem of pathValue.items) {
      const method = String(opItem.key.value).toLowerCase();
      if (!HTTP_METHODS.has(method)) continue;

      const op = opItem.value;
      const label = { path: pathKey, method };
      const xmintPair = op.items?.find((p) => String(p.key.value) === "x-mint");

      if (!xmintPair) {
        // Case D: no x-mint at all. Insert the full block, as before.
        const lastPair = op.items[op.items.length - 1];
        const opIndent = indentOf(text, lastPair.key.range[0]);
        const insertText =
          `${" ".repeat(opIndent)}x-mint:${nl}` +
          `${" ".repeat(opIndent + 2)}metadata:${nl}` +
          `${" ".repeat(opIndent + 4)}${FIELD_LINE}${nl}`;
        inserts.push({ ...label, offset: op.range[1], insertText });
        continue;
      }

      const xmintNode = xmintPair.value;
      if (!isMap(xmintNode)) {
        anomalies.push({ ...label, reason: "x-mint is not a mapping (scalar/null/flow)" });
        continue;
      }

      const metadataPair = xmintNode.items.find((p) => String(p.key.value) === "metadata");

      if (!metadataPair) {
        // Case B (the common case here): x-mint exists but has no
        // metadata key yet. Add metadata as a new sibling of e.g. content,
        // i.e. the last child of the x-mint mapping.
        const childIndent = childIndentOf(text, xmintNode, xmintPair.key.range);
        const insertText =
          `${" ".repeat(childIndent)}metadata:${nl}` +
          `${" ".repeat(childIndent + 2)}${FIELD_LINE}${nl}`;
        merges.push({ ...label, kind: "add-metadata", offset: xmintNode.range[1], insertText });
        continue;
      }

      const metadataNode = metadataPair.value;
      if (!isMap(metadataNode)) {
        anomalies.push({
          ...label,
          reason: "x-mint.metadata exists but is not a mapping (scalar/null/flow)",
        });
        continue;
      }

      if (metadataNode.items.some((p) => String(p.key.value) === FIELD_NAME)) {
        alreadySet.push(label);
        continue;
      }

      // Case A: x-mint.metadata exists and is a mapping, just missing our
      // field. Add it as the last child of that existing metadata map,
      // preserving every field already there.
      const childIndent = childIndentOf(text, metadataNode, metadataPair.key.range);
      const insertText = `${" ".repeat(childIndent)}${FIELD_LINE}${nl}`;
      merges.push({ ...label, kind: "add-field", offset: metadataNode.range[1], insertText });
    }
  }

  const totalOps = inserts.length + merges.length + alreadySet.length + anomalies.length;
  return { relPath, totalOps, inserts, merges, alreadySet, anomalies };
}

// Applies text-splice edits without ever re-serializing the document.
// Edits are applied from the end of the file backward so earlier offsets
// stay valid as the string grows.
function applyEdits(text, edits) {
  const sorted = [...edits].sort((a, b) => b.offset - a.offset);
  let result = text;
  for (const edit of sorted) {
    result = result.slice(0, edit.offset) + edit.insertText + result.slice(edit.offset);
  }
  return result;
}

function printSampleDiff(file, sample, label) {
  const after = applyEdits(file.raw, [sample]);
  const windowStart =
    file.raw.lastIndexOf("\n", Math.max(0, sample.offset - 400)) + 1;
  const beforeWindow = file.raw.slice(windowStart, sample.offset + 60);
  const afterOffset = sample.offset + sample.insertText.length;
  const afterWindow = after.slice(windowStart, afterOffset + 60);
  // Display only: normalize CRLF to LF so terminals that mishandle a lone
  // \r don't garble the preview. The actual write uses \r\n.
  const forDisplay = (s) => s.replace(/\r\n/g, "\n");
  console.log(
    `--- ${label} (${file.relPath}: ${sample.method.toUpperCase()} ${sample.path}) ---`
  );
  console.log("BEFORE:");
  console.log(forDisplay(beforeWindow));
  console.log("AFTER:");
  console.log(forDisplay(afterWindow));
}

function runOpenApiPass() {
  const perFile = [];

  for (const relPath of OPENAPI_TARGETS) {
    const absPath = path.join(REPO_ROOT, relPath);
    const raw = fs.readFileSync(absPath, "utf8");
    const usesCRLF = /\r\n/.test(raw);
    const result = collectOpenApiEdits(relPath, raw, usesCRLF);
    perFile.push({ ...result, absPath, raw, usesCRLF });
  }

  console.log("Operation count per file:");
  for (const f of perFile) {
    console.log(
      `  ${f.relPath}: ${f.totalOps} operation(s) total -> ` +
        `${f.inserts.length} new x-mint block, ` +
        `${f.merges.length} merged into existing x-mint, ` +
        `${f.alreadySet.length} already set (skipped), ` +
        `${f.anomalies.length} anomaly (skipped, needs manual review)`
    );
  }
  console.log("");

  const totalAlready = perFile.reduce((n, f) => n + f.alreadySet.length, 0);
  if (totalAlready > 0) {
    console.log(`Operations that already have ${FIELD_NAME}: true (skipped, ${totalAlready}):`);
    for (const f of perFile) {
      for (const op of f.alreadySet) {
        console.log(`  ${f.relPath}: ${op.method.toUpperCase()} ${op.path}`);
      }
    }
    console.log("");
  }

  const totalAnomalies = perFile.reduce((n, f) => n + f.anomalies.length, 0);
  if (totalAnomalies > 0) {
    console.log(`Anomalies (skipped, NOT auto-edited, ${totalAnomalies}):`);
    for (const f of perFile) {
      for (const op of f.anomalies) {
        console.log(`  ${f.relPath}: ${op.method.toUpperCase()} ${op.path} -- ${op.reason}`);
      }
    }
    console.log("");
  }

  const totalInserts = perFile.reduce((n, f) => n + f.inserts.length, 0);
  const totalMerges = perFile.reduce((n, f) => n + f.merges.length, 0);

  if (DRY_RUN) {
    const fileWithMerge = perFile.find((f) => f.merges.length > 0);
    if (fileWithMerge) {
      printSampleDiff(fileWithMerge, fileWithMerge.merges[0], "DRY RUN: sample MERGE diff");
    } else {
      console.log("No sample merge diff to show: no operation needs merging.");
    }
    const fileWithInsert = perFile.find((f) => f.inserts.length > 0);
    if (fileWithInsert) {
      console.log("");
      printSampleDiff(fileWithInsert, fileWithInsert.inserts[0], "DRY RUN: sample NEW-BLOCK diff");
    }
    console.log(`\nDry run complete. No files were modified.`);
    return;
  }

  for (const f of perFile) {
    const allEdits = [...f.inserts, ...f.merges];
    if (allEdits.length === 0) continue;
    const newText = applyEdits(f.raw, allEdits);
    fs.writeFileSync(f.absPath, newText, "utf8");
  }
  const filesChanged = perFile.filter((f) => f.inserts.length + f.merges.length > 0).length;
  console.log(
    `Done. Modified ${filesChanged} file(s): ${totalInserts} new x-mint block(s), ${totalMerges} merge(s).`
  );
}

if (RUN_OPENAPI) {
  runOpenApiPass();
} else {
  runMdxPass();
}
