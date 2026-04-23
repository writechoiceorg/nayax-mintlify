# API Test Plan — Spark (Nayax)

**Date:** {/* YYYY-MM-DD */}  
**Tester:** Anayse Benedito  
**Product scope:** Spark — RemoteStart V2  
**OpenAPI spec:** `openapi/spark.yaml`  
**Bruno collection:** `api-testing/spark/collection/`  
**Bruno environment:** `api-testing/spark/collection/environments/sandbox.bru`  

## Objective

{/*
One sentence: what flow or behavior you are verifying in this run.
Example: "Verify that the Spark payment flow (StartSession → TriggerTransaction → Settlement)
returns the correct response codes and fields as defined in openapi/spark.yaml."
*/}

## Prerequisites checklist

- [ ] Sandbox API key filled in `sandbox.bru`
- [ ] Sandbox base URL confirmed (replace default `nayax-spark-dmz.nayax.com` if different)
- [ ] `SITE_ID` filled in `sandbox.bru`
- [ ] Confirmed with Marcos which endpoints can be tested without a physical device
- [ ] Reviewed onboarding doc from Nayax

## Available endpoints (Spark spec)

| Endpoint | Method | Needs device? | Notes |
|----------|--------|---------------|-------|
| `/Version` | GET | No | Simple health check — good first test |
| `/InfoQuery` | POST | TBC | Query machine/site info |
| `/AvailabilityCheck` | POST | TBC | Check if site is available |
| `/StartAuthentication` | POST | TBC | Authenticate before session |
| `/StartSession` | POST | Likely yes | Opens session on device |
| `/TriggerTransaction` | POST | Likely yes | Triggers payment on device |
| `/TransactionCallback` | POST | Callback | Nayax calls your server |
| `/TransactionNotify` | POST | Callback | Nayax calls your server |
| `/ExternalCancel` | POST | Needs tx ID | Cancels authorized transaction |
| `/ExternalSettlement` | POST | Needs tx ID | Settles a transaction |
| `/CancelTransaction` | POST | Likely yes | |
| `/Settlement` | POST | Needs tx ID | |
| `/StopNotify` | POST | Callback | |
| `/StopCallback` | POST | Callback | |
| `/DeclineCallback` | POST | Callback | |
| `/TimeoutCallback` | POST | Callback | |

> Callback endpoints (`*Callback`, `*Notify`) are called **by Nayax** to your server — they cannot be directly tested outbound. Exclude from this run.

## Test cases for this run

{/* Fill in the specific endpoints you will test. Start simple: /Version first, then build up. */}

| # | Endpoint | Method | Objective | Expected status | Expected key fields |
|---|----------|--------|-----------|-----------------|---------------------|
| 1 | /Version | GET | Confirm API is reachable and returns version | 200 | `version`, `build` (or similar) |
| 2 | | | | | |
| 3 | | | | | |

## Flow sequence (if endpoints depend on each other)

{/*
If testing a multi-step flow, list the sequence and what to capture between steps.
Example:
1. POST /StartAuthentication → capture `token` from response
2. POST /StartSession using captured `token` → capture `sessionId`
3. POST /TriggerTransaction using `sessionId`
4. POST /ExternalCancel using `NayaxTransactionID` from step 3
*/}

1. 

## Success criteria

{/*
What does "this run passed" mean?
Example: "All tested endpoints return the status code in the spec.
Field names in responses match the schema in openapi/spark.yaml.
No unexpected 4xx or 5xx errors."
*/}

---

## How to run

Open Claude Code in this repo and use this prompt:

```
Follow the API testing instructions in CLAUDE.md.
Test plan: api-testing/spark/test-plan.md
OpenAPI spec: openapi/spark.yaml
Bruno collection: api-testing/spark/collection/
Bruno environment: api-testing/spark/collection/environments/sandbox.bru

Test each endpoint in the sequence defined in the test plan, one at a time.
Save each result as a Bruno example. Write the final report to api-testing/spark/reports/api-test-report.md.
```

> Start this in off-hours — a full run takes 30+ minutes and is heavy on Claude token usage.
