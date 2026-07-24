// Applies each language's overlay (openapi/overlays/<lang>/<spec>.yaml) on
// top of its base spec (openapi/<spec>.yaml) and writes the merged result to
// openapi/<lang>/<spec>.yaml -- the file docs.json's <lang> navigation
// actually points at.
//
// Also reports translation coverage: an overlay action whose `update` value
// is still identical to the base spec's current text at that path counts as
// untranslated (this is exactly the placeholder that `scaffold.mjs` writes
// for new fields).
//
// Usage:
//   npm run openapi:build
//
// Run this after editing an overlay file, or after running openapi:scaffold,
// to regenerate the committed openapi/<lang>/*.yaml files.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { SPECS, LANGS, ROOT, overlayPath, outputPath, basePath, collectBaseFields, loadOverlay } from "./lib.mjs";

const OPENAPI_FORMAT_BIN = path.join(ROOT, "node_modules", ".bin", "openapi-format");

let exitCode = 0;

for (const spec of SPECS) {
  const baseFields = collectBaseFields(basePath(spec));

  for (const lang of LANGS) {
    const overlayFile = overlayPath(lang, spec.name);
    const outFile = outputPath(lang, spec.name);

    if (!fs.existsSync(overlayFile)) {
      console.log(`${spec.name} (${lang}): no overlay file yet -- run npm run openapi:scaffold first. Skipping.`);
      exitCode = 1;
      continue;
    }

    fs.mkdirSync(path.dirname(outFile), { recursive: true });

    try {
      execFileSync(
        OPENAPI_FORMAT_BIN,
        [basePath(spec), "-l", overlayFile, "-o", outFile, "--no-sort", "--yamlQuoteStyle", "double"],
        { stdio: "pipe" }
      );
    } catch (err) {
      console.error(`${spec.name} (${lang}): openapi-format failed`);
      console.error(err.stdout?.toString() ?? err.message);
      exitCode = 1;
      continue;
    }

    const overlay = loadOverlay(overlayFile, lang);
    let translated = 0;
    let untranslated = 0;
    let staleCount = 0;
    for (const action of overlay.actions) {
      const currentBaseText = baseFields.get(action.target);
      if (currentBaseText === undefined) {
        staleCount++;
        continue;
      }
      if (action.update === currentBaseText) {
        untranslated++;
      } else {
        translated++;
      }
    }
    const total = translated + untranslated;
    const pct = total ? Math.round((translated / total) * 100) : 100;

    console.log(
      `${spec.name} (${lang}): wrote ${path.relative(ROOT, outFile)} -- ` +
        `${translated}/${total} fields translated (${pct}%)` +
        (staleCount ? `, ${staleCount} stale overlay action(s) ignored` : "")
    );
  }
}

process.exit(exitCode);
