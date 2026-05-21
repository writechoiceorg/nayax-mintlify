---
name: nayax-lynx-api-testing
description: >-
  Use this skill when running or continuing a Lynx API test session, classifying
  a new endpoint failure, deciding whether a finding needs a doc update, updating
  the test report or gap log, or diagnosing an unexpected API response. This is a
  routing guide — it points to the right files and surfaces critical testing rules
  so Claude does not re-discover known behaviors from scratch.
---

Lynx API testing validates that the OpenAPI spec and documentation match the actual API behavior.
Collection: `api-testing/lynx/`. Reports: `api-testing/lynx/reports/`.

## Report versioning

Each test run produces a new versioned report file. Do not overwrite the previous report.

- Naming convention: `LYNX-TEST-REPORT-V{N}.md` where N increments each run.
- Current reports live in `api-testing/lynx/reports/`.
- To start a new run: copy `api-testing/TEST-REPORT-TEMPLATE.md` → `api-testing/lynx/reports/LYNX-TEST-REPORT-V{N}.md`, fill in the date and tester, then work from that file.
- The previous report is the baseline. Carry forward any unresolved failures. Document what changed in Section 2.

## Before starting any test session

Read these files in order:

| File | Path | What it contains |
|------|------|-----------------|
| Latest report | `api-testing/lynx/reports/` — highest V number | Pass/fail baseline, sandbox reference data, open Nayax action items |
| README | `api-testing/lynx/README.md` | Test methodology, run order, collection structure |
| Known behaviors | `<references/known-behaviors.md>` | Confirmed quirks — read before diagnosing any failure |

## Failure categories

Assign every finding to one category. The category determines who acts and when.

| Category | Criteria | Action |
|----------|----------|--------|
| **A — Permission-gated** | 403 or 401 on a valid, well-formed request; sandbox token lacks the required role | Log in `gap-log.md`. Add to Nayax action list in the report. No doc update until permission is granted. |
| **B — Server bug** | 500 on a valid request, or incorrect HTTP status wrapping a logical failure | Log in `gap-log.md`. Add to Nayax action list. Add a Warning callout to the relevant doc page describing the actual behavior. |
| **C — Sandbox gap** | Request is valid, API logic is correct, but required sandbox data or configuration is missing | Log in `gap-log.md`. Add a sandbox setup request for Nayax. No doc change. |
| **D — Doc/collection gap** | Request failed because docs or YAML were unclear or wrong — the fix is in our control | Fix the collection YAML or doc page immediately. Log in `gap-log.md` with `Status: Fixed`. |

## After each test run

1. Log every new finding in `api-testing/lynx/gap-log.md` (template in `<references/doc-workflow.md>`).
2. Fill in the new versioned report — update the summary table, add resolved items to Section 2, add new failures to Section 3.
3. Carry forward any unresolved Category A/B/C failures from the previous report into Section 3 of the new one.
4. For Category D: fix the collection YAML or doc page; mark gap-log entry `Fixed: docs`.
5. For Category B: add a Warning or Note to the relevant guide page even if the bug is not fixed yet — developers will hit this behavior regardless.
6. Update `<references/known-behaviors.md>` with any newly discovered behavioral quirks.

## Critical testing rules

1. **Source of truth is the OpenAPI spec.** Check `openapi/lynx.yaml` before deciding whether a response is wrong. If the spec says 200 and you get 200, the problem may be in the response body, not the status code.
2. **A 401 with a response body is a scope issue, not a bad token.** The token reached the server and was validated. Contact Nayax — retrying with the same token will not help. See `<references/known-behaviors.md>` for the full 401/403 table.
3. **Check sandbox reference data before testing any endpoint.** Using the wrong ID format (ActorCode instead of ActorID, wrong CountryID) causes 400 or silent wrong-data responses. Reference table is in `api-test-report.md` Section 6.
4. **Category B bugs still need doc callouts.** Users hit server bugs regardless of whether Nayax has fixed them. Add a Warning to the relevant guide page describing the actual behavior and any workaround.
5. **Do not test write endpoints before confirming with GET.** Read the current state first, especially for machines, cards, and scheduling — writes are difficult to undo in sandbox.
6. **Silent 200s are the hardest failures.** Refund endpoints, Move Devices, and Pick Lists all return 200 on failure or no-op. Always inspect the response body, not just the status code.

## Sandbox constants

These are confirmed values — do not guess IDs when these are available.

| Field | Value |
|-------|-------|
| Sandbox ActorID | `2009586082` |
| Sandbox ActorCode | `1222` |
| CountryID (actor endpoints) | `840` — ISO numeric |
| CountryID (lookup endpoints) | `225` — Nayax internal |
| CurrencyID | `3` — USD |
| Test MachineID | `1002529791` |
| Test Card (standard prepaid) | `TEST-CARD-004` / CardID `999998796245511` — RevalueCashBit: null |
| Test Card (revalue-capable) | `TEST-CARD-V2-RETEST-001` / CardID `999998796299591` — RevalueCashBit: true |
| Valid SalesSourceID | `30000512` |
| Valid TaskLutId (Machine Fill) | `996231359` |
| Valid TaskLutId (Cash Collection) | `996231358` |

Full table with all reference values is in `api-test-report.md` Section 6.
