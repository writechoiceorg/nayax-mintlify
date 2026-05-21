# Doc Workflow

How a test finding moves from a raw observation to a doc update, gap-log entry, or Nayax action item.

---

## Decision tree

```
New finding
│
├─ Is the request malformed or the collection wrong?
│   └─ YES → Category D. Fix collection YAML or doc page. Log gap-log: Status: Fixed.
│
├─ Does the API return 403/401 with no diagnostic?
│   └─ YES → Category A. Log gap-log. Add to "Nayax action list" in report.
│
├─ Does the API return 500, or 200 wrapping a failure?
│   └─ YES → Category B. Log gap-log. Add Warning to doc page. Add to Nayax action list.
│
└─ Is the request valid but sandbox data is missing?
    └─ YES → Category C. Log gap-log. Add to Nayax sandbox setup requests in report.
```

When in doubt, check `<references/known-behaviors.md>` — most ambiguous failures are already catalogued there.

---

## Gap log entry template

```
## [Endpoint name] — YYYY-MM-DD
**Gap**: What was unclear or missing in the Nayax docs or spec
**Impact**: Self-serviceable without support? Yes / No / Partially
**Suggestion**: Specific fix (collection YAML path, doc file path, or Nayax team ask)
**Status**: Open | Fixed: collection | Fixed: docs | Fixed: openapi | Pending Nayax
```

File: `api-testing/lynx/gap-log.md`

---

## When to add a doc callout

Not every failure needs a doc change. Use this table:

| Situation | What to add | Component |
|-----------|------------|-----------|
| Endpoint has a non-obvious required field | Document the field in the guide page | `<Note>` |
| Endpoint returns 200 with empty body on success | Explain expected behavior | `<Note>` |
| Endpoint silently fails with empty 200 | Warn users to check the body | `<Note>` |
| Endpoint has a known server bug producing wrong status or leaking data | Document actual behavior + workaround if any | `<Warning>` |
| Field must be set at creation and cannot be changed later | Call it out prominently | `<Warning>` |
| Permission required beyond standard operator token | Clarify who to contact | `<Warning>` |

---

## Doc file map

Which API area maps to which guide page in `docs/manage-data-operations/lynx-api/`:

| API area | Guide page |
|----------|------------|
| Auth, tokens, 401/403 errors | `error-handling.mdx` and `security.mdx` |
| Actor hierarchy, ActorID/ActorCode | `operator/nayax-hierarchy.mdx`, `operator/retrieve-hierarchy.mdx` |
| Payment methods (actor) | `operator/payment-methods.mdx` |
| Cards — create, update | `cards/create-cards.mdx` |
| Cards — revalue | `cards/create-cards.mdx` (Warning block) |
| Machines — create, update | `machines/` directory |
| Pick lists | `inventory-management/pick-lists.mdx` |
| Machine inventory | `inventory-management/machine-inventory.mdx` |
| Devices — move | `devices/moving-device-between-operators.mdx` |
| Payment, refunds | `payments/` directory (create if missing) |
| Scheduling — drivers, tasks, routes | `scheduling/drivers-and-tasks.mdx`, `scheduling/routes.mdx` |
| Lookups, CountryID | `reference-data.mdx` |
| Error handling, permission categories | `error-handling.mdx` |

---

## Updating the test report

Each test run gets its own versioned file. Do not overwrite the previous report.

**Starting a new run:**
1. Find the highest version number in `api-testing/lynx/reports/` (e.g. `LYNX-TEST-REPORT-V2.md`).
2. Copy `api-testing/TEST-REPORT-TEMPLATE.md` to `api-testing/lynx/reports/LYNX-TEST-REPORT-V{N+1}.md`.
3. Fill in the Dates and Tester fields at the top.
4. Carry forward all unresolved failures from the previous report into Section 3.

**Filling in the new report:**
1. **Summary table** (Section 1) — update pass/fail/skip counts for changed folders.
2. **What Changed** (Section 2) — document anything that moved from failing to passing since the last version. Credit whether Nayax fixed it or we fixed the collection.
3. **Current Failures** (Section 3) — new failures go here with Key Finding blocks for any Category B items. Remove items that are now passing.
4. **Nayax Action List** (Section 4) — carry forward unresolved items from last report; add new ones.
5. **Our Open Items** (Section 5) — update doc items; mark completed ones.
6. **Sandbox Reference Data** (Section 6) — add any new confirmed values; carry forward existing values.

The previous report is read-only once a new version exists. Never modify a prior version.
