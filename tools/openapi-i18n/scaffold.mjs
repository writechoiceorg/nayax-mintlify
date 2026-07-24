// Scans each base OpenAPI spec in SPECS (see lib.mjs) and updates its overlay
// file for every language in LANGS so every translatable description/summary
// field has an action.
//
// Safe to re-run at any time:
//   - Existing actions (already translated, or still a placeholder) are left
//     untouched, in their current order.
//   - New fields found in the base spec (new endpoints, new schema
//     properties, etc.) are appended as new actions, with `update` set to
//     the current English text -- that's the "needs translation" marker.
//   - Actions whose target no longer exists in the base spec are reported as
//     stale, but NOT removed automatically (an endpoint/field may just have
//     moved; removing translated work silently would be worse than a warning).
//
// Usage:
//   npm run openapi:scaffold
//
// After running, search the overlay files for `update` values that still
// read as English and translate them.

import { SPECS, LANGS, overlayPath, loadOverlay, saveOverlay, collectBaseFields, basePath } from "./lib.mjs";

let totalNew = 0;
let totalStale = 0;

for (const spec of SPECS) {
  const baseFields = collectBaseFields(basePath(spec));

  for (const lang of LANGS) {
    const file = overlayPath(lang, spec.name);
    const overlay = loadOverlay(file, lang);
    const existingTargets = new Set(overlay.actions.map((a) => a.target));

    let added = 0;
    for (const [target, text] of baseFields) {
      if (!existingTargets.has(target)) {
        overlay.actions.push({ target, update: text });
        added++;
      }
    }

    const stale = overlay.actions.filter((a) => !baseFields.has(a.target));

    saveOverlay(file, overlay);

    totalNew += added;
    totalStale += stale.length;

    console.log(
      `${spec.name} (${lang}): ${overlay.actions.length} total actions, ` +
        `+${added} new, ${stale.length} stale` +
        (stale.length ? " -- targets no longer in base spec:" : "")
    );
    for (const a of stale) {
      console.log(`    ${a.target}`);
    }
  }
}

console.log(`\nDone. ${totalNew} new field(s) added across all overlays, ${totalStale} stale reference(s).`);
if (totalNew > 0) {
  console.log("Open the overlay files under openapi/overlays/ and translate the new `update` values.");
}
