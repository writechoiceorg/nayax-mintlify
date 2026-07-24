// Shared helpers for the OpenAPI overlay translation pipeline.
// See tools/openapi-i18n/README.md for the full workflow.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as YAML from "yaml";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

// One entry per OpenAPI spec that has a translated variant. Add a spec here
// once its base file exists in openapi/ and you want a zh (or other target
// language) reference section for it.
export const SPECS = [
  { name: "cortina", base: "openapi/cortina.yaml" },
  { name: "spark", base: "openapi/spark.yaml" },
  { name: "lynx", base: "openapi/lynx.yaml" },
];

// Target languages to maintain overlays for. Adding a language here does not
// wire it into docs.json by itself -- see tools/openapi-i18n/README.md.
export const LANGS = ["zh"];

export const overlayPath = (lang, specName) =>
  path.join(ROOT, "openapi", "overlays", lang, `${specName}.yaml`);

export const outputPath = (lang, specName) =>
  path.join(ROOT, "openapi", lang, `${specName}.yaml`);

export const basePath = (spec) => path.join(ROOT, spec.base);

// Fields that hold human-readable prose in an OpenAPI document. Everything
// else (keys, enum values, types, examples) is left untouched by design --
// only these get a translation entry.
const TRANSLATABLE_KEYS = new Set(["description", "summary"]);

// Renders an object key as a JSONPath segment compatible with the OpenAPI
// Overlay Specification / openapi-format's target resolver, e.g.
// `.simpleKey` or `['/paths/with-slashes']`.
function jsonPathSegment(key) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(String(key))
    ? `.${key}`
    : `['${String(key).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}']`;
}

// Walks an OpenAPI document (already parsed to plain JS objects/arrays) and
// yields { target, text } for every translatable string field, where target
// is a JSONPath expression pointing at that field from the document root.
export function* walkTranslatable(node, pathSoFar = "$") {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      yield* walkTranslatable(node[i], `${pathSoFar}[${i}]`);
    }
    return;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      const childPath = pathSoFar + jsonPathSegment(key);
      if (TRANSLATABLE_KEYS.has(key) && typeof value === "string" && value.trim()) {
        yield { target: childPath, text: value };
      } else {
        yield* walkTranslatable(value, childPath);
      }
    }
  }
}

export function loadYaml(filePath) {
  return YAML.parse(fs.readFileSync(filePath, "utf8"));
}

export function loadOverlay(filePath, lang) {
  if (!fs.existsSync(filePath)) {
    return {
      overlay: "1.0.0",
      info: { title: `${lang} translation overlay`, version: "1.0.0" },
      actions: [],
    };
  }
  return loadYaml(filePath);
}

export function saveOverlay(filePath, overlay) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, YAML.stringify(overlay, { lineWidth: 0 }));
}

export function collectBaseFields(specBasePath) {
  const doc = loadYaml(specBasePath);
  const fields = new Map();
  for (const { target, text } of walkTranslatable(doc)) {
    fields.set(target, text);
  }
  return fields;
}
