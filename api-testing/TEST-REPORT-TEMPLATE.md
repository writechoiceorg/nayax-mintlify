# Nayax [API Name] — Test Report

**Dates:** YYYY-MM-DD to YYYY-MM-DD
**Tester:** [Name]
**Sandbox:** [base URL]
**Collection:** `api-testing/[product]/`
**OpenAPI spec:** `openapi/[product].yaml`

---

## 1. Summary

One row per folder. Update pass/fail/skip counts after each run.

| Folder | Endpoints | Passed | Failed | Skipped | Notes |
|--------|-----------|--------|--------|---------|-------|
| [Folder name] | 0 | 0 | 0 | 0 | |
| **TOTAL** | **0** | **0** | **0** | **0** | |

**Overall pass rate:** X / Y tested = **Z%**

---

## 2. What Changed Since Last Run

Add a row each time a previously failing endpoint starts passing (whether because Nayax fixed it or because we fixed the collection).

### Resolved by Nayax

| Endpoint | Was | Now |
|----------|-----|-----|
| | | |

### Resolved by collection / doc fixes

| Endpoint | Was | Now |
|----------|-----|-----|
| | | |

---

## 3. Current Failures

### Category A — Permission-gated (403 / 401)

*Nayax must grant sandbox token access. Nothing to fix on our side.*

| Endpoint | Folder | Ask |
|----------|--------|-----|
| | | |

### Category B — Server bugs

*Valid request causes a server error or incorrect response.*

| Endpoint | Error | Details |
|----------|-------|---------|
| | | |

#### Key Findings — Category B

Document each server bug as a named finding so Claude can surface it in doc callouts without re-reading the raw failure table.

---

**Key Finding: [Short name, e.g. "Refund endpoints wrap failure in 200"]**

**What happens:**
```
POST /v1/payment/refund-request
HTTP 200 OK
{
  "Status": "failed",
  "Result": "You are not allowed to perform this action"
}
```

**Expected:** HTTP 403 or 400
**Actual:** HTTP 200 with `Status: "failed"` in body
**Doc implication:** Add a Warning to the relevant guide page. Users cannot rely on HTTP status code — must check the body `Status` field.

---

*(Add one Key Finding block per Category B item)*

### Category C — Sandbox data / configuration gaps

*Endpoint logic is correct but sandbox lacks required data.*

| Issue | Blocked endpoint(s) | Ask |
|-------|--------------------|----|
| | | |

### Category D — Doc/collection gaps fixed during testing

*Request format was wrong; we fixed it.*

| # | Endpoint | What was wrong | Fix applied |
|---|----------|----------------|-------------|
| 1 | | | |

---

## 4. Nayax Team Action List

### Blocking — cannot test without these

1. **[Action]** — [why it's blocking]

### Server bugs to fix

2. **[Endpoint]** — [description]

### API correctness / spec issues

3. **[Item]** — [description]

---

## 5. Our Open Items (docs)

| Item | File | What's needed |
|------|------|---------------|
| | | |

---

## 6. Sandbox Reference Data

Confirmed values — do not guess IDs when these are available.

| Field | Value | Notes |
|-------|-------|-------|
| Sandbox base URL | | |
| Sandbox ActorID | | |
| Sandbox ActorCode | | |
| CountryID (actor endpoints) | | ISO numeric |
| CountryID (lookup endpoints) | | Nayax internal |
| CurrencyID | | |
| [Add rows as values are confirmed during testing] | | |
