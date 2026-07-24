# OpenAPI translation pipeline

Generates translated OpenAPI specs (currently zh) for Cortina, Spark, and
Lynx using the [OpenAPI Overlay Specification](https://spec.openapis.org/overlay/latest.html)
applied via [`openapi-format`](https://openapi-format.com).

Instead of hand-maintaining a full duplicate copy of each spec per language,
each language has a small **overlay** file that lists only the translated
`description`/`summary` strings, targeted by JSONPath. The pipeline applies
the overlay on top of the real base spec to produce the file `docs.json`
actually serves.

```
openapi/
  cortina.yaml, spark.yaml, lynx.yaml   # base specs (English, source of truth)
  overlays/zh/*.yaml                     # translated strings only, per language
  zh/*.yaml                              # generated -- do not hand-edit
```

## Workflow

1. **Scaffold** -- discover every translatable field and add a placeholder
   entry (the current English text) for any that don't have a translation yet:

   ```
   npm install   # one-time
   npm run openapi:scaffold
   ```

   Safe to re-run any time the base specs change (new endpoint, new schema
   property, etc.). It never overwrites an existing translation, only adds
   new entries and reports (without removing) any overlay action whose
   target no longer exists in the base spec.

2. **Translate** -- open `openapi/overlays/zh/<spec>.yaml` and edit the
   `update` value of each action. An action whose `update` is still
   word-for-word the English source is untranslated.

3. **Build** -- apply the overlays and regenerate the committed output:

   ```
   npm run openapi:build
   ```

   Prints a per-spec coverage summary, e.g. `cortina (zh): wrote
   openapi/zh/cortina.yaml -- 210/418 fields translated (50%)`. Commit the
   regenerated `openapi/zh/*.yaml` files.

`docs.json`'s zh navigation points its Cortina/Spark/Lynx "API Reference"
groups at `openapi/zh/<spec>.yaml` (distinct `directory` from the English
version, so both sets of generated pages can coexist).

## Adding a spec or language

Edit the `SPECS` / `LANGS` arrays in `tools/openapi-i18n/lib.mjs`, then run
`npm run openapi:scaffold`. You'll also need to add the corresponding
`openapi` navigation group under that language in `docs.json`, following the
existing zh Cortina/Spark/Lynx entries as a template.

## Known limitations

- `openapi-format`'s YAML serializer occasionally re-types ambiguous
  `example` scalars on round-trip (a date-like string becomes a native
  `!!timestamp`, a numeric-looking string becomes an int). Verified this
  affects only `example` values, never `description`/`summary` or any
  schema/path/parameter structure -- confirmed by a deep-equal diff against
  the base spec after a zero-translation build. Cosmetic, not a content or
  contract change.
- Re-running `openapi:scaffold` does not preserve YAML comments in the
  overlay files (the `yaml` library round-trips data, not comments). Leave
  translator notes in a separate doc if needed.
- Coverage reporting treats "still equals the English source" as the only
  signal for "untranslated." If the base spec's English text changes after a
  field was already translated, the overlay's (now stale) translation is
  still applied silently -- there's no automatic staleness detection for
  translated-but-since-changed source text.
