# Nayax Lynx API — Test Report

**Dates:** 2026-05-13 to 2026-05-20
**Tester:** Anayse (WriteChoice)
**Sandbox:** https://qa-lynx.nayax.com
**Collection:** Bruno YAML collection at `api-testing/lynx/`
**OpenAPI spec:** `openapi/lynx.yaml`

---

## 1. Summary

| Folder | Endpoints | Passed | Failed | Skipped | Notes |
|--------|-----------|--------|--------|---------|-------|
| Sign In | 2 | 2 | 0 | 0 | |
| Actors | 20 | 13 | 5 | 2 | 3× encryption 403, EV Meter 500, Create v2 billing |
| Lookups | 18 | 17 | 1 | 0 | Regions 403 |
| Devices | 4 | 2 | 2 | 0 | DeviceID=0, Move Devices silent fail |
| EReceipt | 1 | 0 | 1 | 0 | Permission open; no sandbox transactions |
| Cards | 20 | 18 | 0 | 2 | Transfer Revalue (2nd card), Validate (no machine/card pair) |
| Machine Attribute | 7 | 6 | 0 | 1 | Update Model Defaults skipped (sandbox risk) |
| Machine Inventory | 6 | 4 | 0 | 2 | Empty Inventory + Set Bins skipped (sandbox risk) |
| Machine Products | 5 | 5 | 0 | 0 | |
| Machines | 15 | 13 | 0 | 2 | Get by Device/VPOS skipped (no serials in sandbox) |
| Metadata | 2 | 0 | 2 | 0 | Both 403 |
| Payment / Refunds | 4 | 1 | 3 | 0 | Upload passes; Request + Decline = logical-200 bug; Approve = 500 |
| Product Groups | 9 | 4 | 4 | 0 | Tax endpoints 403 |
| Products | 4 | 4 | 0 | 0 | |
| Report | 2 | 2 | 0 | 0 | |
| Scheduling | 16 | 5 | 11 | 0 | 5 GETs pass; writes mostly 403/500 |
| **TOTAL** | **155** | **96** | **29** | **9** | |

**Overall pass rate:** 96 / 146 tested = **66%** (up from 58% at 2026-05-15)

---

## 2. What Changed Since Last Report (2026-05-15)

### Resolved by Nayax

| Endpoint | Was | Now |
|----------|-----|-----|
| POST /v2/cards (Create New Card v2) | 500 — empty body, no diagnostic | 200 — full card object returned |
| Scheduling GET endpoints (×4) | 403 — all blocked | 200 — Drivers, Routes, Visit Orders, Machine Tasks all pass |
| Machine payment methods (×4) | 400/500 — no payment methods enabled | 200 — Nayax enabled payment methods for sandbox |
| POST /v1/ereceipt/generate | 403 — permission denied | 400 `transaction_not_found` — permission open, needs real transaction |

### Resolved by collection fixes

| Endpoint | Was | Now |
|----------|-----|-----|
| POST /v1/payment/upload-refund | 500 — empty body | 200 — returns `FileURL` with correct body |
| GET /v1/cards/{id}/revalue | 400 (empty body) | 200 — works with `RevalueCashBit: true` card |
| POST /v1/cards/{id}/revalue/add | 400 (empty body) | 200 — works with `RevalueCashBit: true` card |
| POST /v1/cards/query | 405 Method Not Allowed | 200 — endpoint restored; returns `[]` |
| GET /v1/Scheduling/route-machines | 400 — empty params | 200 — works with `MachineId` param |
| POST /v1/machines | 500 — no diagnostic | 200 — passes with correct enum values |
| PUT /v1/machines/{id}/paymentMethods | 500 | 200 — resolved with payment methods enabled |
| Update Prepaid Card | 400 — missing required fields | 200 — credit limit fields added |
| Create/Update Machine Products | 400 — NayaxProductID null | 200 — valid product ID set |

---

## 3. Current Failures

### Category A — Permission-gated (403)
*Nayax must grant sandbox token access. Nothing to fix on our side.*

| Endpoint | Folder | Ask |
|----------|--------|-----|
| GET Encryption Keys by ActorID | Actors | Grant encryption role |
| PUT Generate Encryption Key | Actors | Grant encryption role |
| PUT Decrypt Message by Encryption Version | Actors | Grant encryption role |
| GET Regions | Lookups | Clarify minimum role |
| GET Event Rules (`/v1/metadata/v1/event-rules`) | Metadata | Grant metadata permission |
| POST Upload Picture | Metadata | Grant metadata permission |
| GET/POST/PUT/DELETE Product Group Tax | Product Groups | Grant tax management permission |
| POST Create New Route | Scheduling | Full write permission not granted |
| PUT Update Route | Scheduling | Full write permission not granted |
| DELETE Delete Driver | Scheduling | Full write permission not granted |
| DELETE Remove Machine from Route | Scheduling | Full write permission not granted |
| POST Create Visit Orders | Scheduling | Full write permission not granted |
| PUT Update Machine Tasks | Scheduling | Full write permission not granted |

**Total blocked by permissions: 13 endpoints**

---

### Category B — Server bugs
*Valid request causes a server error or incorrect response. Nayax engineering must investigate.*

| Endpoint | Error | Details |
|----------|-------|---------|
| POST Create Machine Tasks | 500 "Oops something went wrong" | Fails server-side with fully valid payload (`MachineId=1002529791`, `TaskLutId=996231359`). No diagnostic body. |
| POST Approve Refund | 500 + internal URL leak | Response exposes `http://qailapi01.nayaxvend.int:5064` — security issue. Downstream returns 400 but gateway wraps it as 500. |
| POST Request Refund | 200 wrapping failure | Body: `{"Result":"You are not allowed...","Status":"failed"}`. Should be 403 or 400. |
| POST Decline Refund | 200 wrapping failure | Same pattern — HTTP 200 masks a logical rejection. |
| DELETE Machine Tasks | 200 with dummy object | Returns `[{"MachineId":0,...all nulls}]` instead of `[]` when no tasks match. |
| GET Operator EV Meter Dashboard | 400/500 | `TimePeriod=1` returns 400 with no valid values documented; date range params trigger 500 null reference. |
| GET Available Widgets | 500 leaks internal URL | `screenTypeId=0` exposes `http://qailapi01.nayaxvend.int:6009` in error body. |

#### Key Findings — Category B

---

**Key Finding: Refund endpoints wrap logical failure in HTTP 200**

**What happens:**
```
POST /v1/payment/refund-request
HTTP 200 OK
{
  "Result": "You are not allowed to perform this action",
  "Status": "failed"
}
```
Same pattern for `POST /v1/payment/refund-decline`.

**Expected:** HTTP 403 or 400
**Actual:** HTTP 200 with `"Status": "failed"` in body
**Doc implication:** Add Warning to the payment/refunds guide page. Users cannot rely on HTTP status — must check `Status` field in the response body.

---

**Key Finding: Approve Refund leaks internal hostname**

**What happens:**
```
POST /v1/payment/refund-approve
HTTP 500 Internal Server Error
{
  "message": "Error calling http://qailapi01.nayaxvend.int:5064/...",
  ...
}
```

**Expected:** HTTP 200 with approval confirmation
**Actual:** 500 exposing internal service URL `qailapi01.nayaxvend.int`
**Doc implication:** Add Warning: endpoint is non-functional in sandbox; the error body leaks an internal hostname. Do not expose this response to end users. Nayax must fix before this endpoint can be documented as usable.

---

**Key Finding: Delete Machine Tasks returns zeroed object on no-match**

**What happens:**
```
DELETE /v1/Scheduling/schedule/machine-tasks
HTTP 200 OK
[
  {
    "MachineId": 0,
    "TaskLutId": null,
    "DriverId": null,
    "ScheduleDate": null,
    "StatusId": null
  }
]
```

**Expected:** `[]` when no tasks match the provided MachineID
**Actual:** Array with one object where all fields are null/zero
**Doc implication:** Add Note to scheduling guide: treat a response where `MachineId` is `0` as a no-match result, not a deleted task.

---

**Key Finding: Create Pick List returns empty 200 on success**

**What happens:**
```
POST /v1/machines/{MachineID}/pickLists
HTTP 200 OK
(empty body)
```

**Expected:** Response body confirming creation
**Actual:** 200 with no body — this is the success state, not an error
**Doc implication:** Add Note to pick lists guide: empty response body is expected. Confirm the list was created with `GET /v1/machines/{id}/pickList`.

---

**Key Finding: Move Devices empty array is a silent fail**

**What happens:**
```
PUT /v1/devices/move/{actorId}
HTTP 200 OK
[]
```

**Expected:** Array of moved device objects, or a 404 if none matched
**Actual:** 200 with empty array when no serial numbers matched
**Doc implication:** Add Note to devices guide: empty array means no devices matched — not a success. Always check that the returned array contains entries.

---

### Category C — Sandbox data / configuration gaps
*Endpoint logic is correct but sandbox lacks the data needed to complete a request.*

| Issue | Blocked endpoint(s) | Ask |
|-------|--------------------|----|
| No real transactions in sandbox | POST /v1/ereceipt/generate | Need at least one real transaction on any machine |
| No `ActorBillingPlanID` configured | POST /v2/actors/{ParentActorID} | Configure at least one billing plan for sandbox |
| `DeviceID: 0` on all device records | GET/PUT /v1/devices/{DeviceID} | Clarify: is DeviceID populated in production? Is DeviceSerial the intended key? |
| No valid `UserId` for driver creation | POST /v1/Scheduling/drivers | Provide a valid UserId from the sandbox account |
| No routes in sandbox | POST /v1/Scheduling/route-machines | Need a route created before route-machine assignment can be tested |

---

### Category D — Spec / collection gaps fixed during testing

| # | Endpoint | What was wrong | Fix applied |
|---|----------|----------------|-------------|
| 1 | Get Actor by ActorCode | Example used ActorID value instead of ActorCode | Fixed: collection |
| 2 | Create Actor v2 | Field named `ActorStatus`; API requires `StatusID` | Fixed: collection |
| 3 | User Sign In | Hardcoded credentials in YAML | Fixed: collection (env vars) |
| 4 | Get Cards | No params sent — always 400; at-least-one rule undocumented | Fixed: collection + docs |
| 5 | Create Virtual Card | Wrong field names; `CardPhysicalType` missing | Fixed: collection |
| 6 | Create New Card v2 / Update Card by ID v2 | Wrong field names; credit limit fields missing | Fixed: collection |
| 7 | Get Credit Card Latest Transactions | Body format undocumented (SHA1/base64) | Fixed: collection |
| 8 | Create New Machine | `SalesSourceID: 1` invalid; correct value is `30000512` | Fixed: collection |
| 9 | Upload Refund Documentation | Body was `{}` | Fixed: collection |
| 10 | Get Available Widgets | `screenTypeId=0` triggers 500; correct value is `1` | Fixed: collection |
| 11 | Create/Update Machine Products | `NayaxProductID` was null | Fixed: collection |
| 12 | Update Pick List | `Products` array was empty — server 500 | Fixed: collection |
| 13 | Update Prepaid Card | Required credit limit fields missing | Fixed: collection |
| 14 | CountryID mismatch | Actor endpoints use ISO numeric; lookup endpoints use internal ID | Fixed: docs |
| 15 | Generate Encryption Key | URL typo: `GenarateEncKey` → `GenerateEncKey` | Fixed: openapi spec |
| 16 | Get Card Revalue / Add to Card Revalue | Example card not configured as revalue (`RevalueCashBit: null`) | Fixed: collection (card → TEST-CARD-V2-RETEST-001) |
| 17 | Get Route Machines | Both params empty — always 400; at-least-one rule undocumented | Fixed: collection |
| 18 | Create Machine Tasks | `MachineId: 0`, `TaskLutId: ""` — always 400 | Fixed: collection |

---

## 4. Consolidated Nayax Team Action List

### Blocking — cannot test without these

1. **Full Scheduling write permissions** — Create Route, Update Route, Create Visit Orders, Update Machine Tasks, Delete Driver, Remove Machine from Route still return 403
2. **Fix Create Machine Tasks (POST /v1/Scheduling/schedule/machine-tasks)** — returns 500 with fully valid payload; no diagnostic body
3. **Sandbox transaction data** — eReceipt endpoint is unblockable without at least one real transaction in the sandbox
4. **Billing plan for sandbox** — Create New Actor v2 blocked until a valid `ActorBillingPlanID` is configured
5. **Provide valid UserId** — needed for Add New Driver / Update Driver in Scheduling

### Server bugs to fix

6. **Approve Refund (POST /v1/payment/refund-approve)** — returns 500; response body leaks `qailapi01.nayaxvend.int` internal hostname (security issue)
7. **Request/Decline Refund** — return HTTP 200 with `{"Status":"failed"}` body; should return 4xx
8. **Delete Machine Tasks** — returns a dummy zeroed task object instead of `[]` when no tasks match
9. **EV Meter Dashboard** — 500 on `StartDate`/`EndDate` params; `TimePeriod` valid values not documented
10. **Get Available Widgets** — `screenTypeId=0` leaks internal hostname in error body (security issue)

### API correctness

11. **Fix eReceipt field name typos** — `TrasactionID` and `TrasactionSiteID` (missing 'n') in spec and API
12. **Confirm `ProductGroupCode`** — silently ignored on POST/PUT; if read-only, mark `readOnly: true` in spec
13. **Confirm Metadata URL** — `/v1/metadata/v1/event-rules` (double version prefix) intentional or bug?
14. **Document `DeviceID = 0`** — all sandbox device records return DeviceID as 0; is this a data issue or is DeviceSerial the intended key?
15. **Document enum values** — `TimePeriod`, `CardPhysicalType` full enum, `TaskLutId` (LutTypeID 675347903) — none have values in spec

---

## 5. Our Open Items (docs)

| Item | File | What's needed |
|------|------|---------------|
| `RevalueCashBit: true` required for revalue endpoints | `cards/create-cards.mdx` | Note: must set at card creation time |
| v2 prepaid required fields | `cards/create-cards.mdx` | `CreditAmountDailyLimit`, `CreditAmountMonthlyLimit`, `CreditAmountMonthlyReload` + `GroupLocationLimits` rule |
| SHA1/base64 body for credit card query | Cards guide | Explain body format for `POST /v1/cards/query` |
| `TaskLutId` enum source | Scheduling docs | Valid values from `GET /v1/lookupTypes/675347903/values` |
| Get Route Machines at-least-one-param rule | Scheduling docs | RouteId, MachineId, or OperatorId required |
| Move Devices empty array = silent fail | `devices/` | Note: empty response means no devices matched |
| Create Pick List empty response body | `inventory-management/` | Note: 200 with no body is expected |
| `ProductGroupCode` may be silently ignored | Product Groups | Pending Nayax clarification |

---

## 6. Sandbox Reference Data

| Field | Value | Notes |
|-------|-------|-------|
| Sandbox base URL | `https://qa-lynx.nayax.com` | Already in env |
| Sandbox ActorID | `2009586082` | Use in all actor-scoped requests |
| Sandbox ActorCode | `1222` | Shorter reference for the same actor |
| Parent Distributor ActorID | `2001312062` | Nayax Integrations |
| CountryID — actor endpoints | `840` | United States, ISO numeric format |
| CountryID — lookup endpoints | `225` | United States, internal Nayax ID |
| CurrencyID | `3` | USD |
| Test NayaxProductID | `999998535696561` | Created in sandbox; use for machine product assignments |
| Valid SalesSourceID | `30000512` | Required for machine creation and update |
| Valid CardTypeID (prepaid) | `33` | Use in Create Virtual Card and Create New Card v2 |
| Valid CardPhysicalType | `2` | Required for card creation (v1); `PhysicalTypeID: 30000528` for v2 |
| Valid PaymentMethodIDs | `1` (Credit Card), `2` (NFC), `3` (QR) | Sandbox operator account has payment methods enabled |
| Test MachineID | `1002529791` | Created 2026-05-15; use for machine-specific operations |
| Test Card (prepaid) | `TEST-CARD-004` | CardID: 999998796245511; `RevalueCashBit: null` — cannot use revalue endpoints |
| Test Card (revalue-capable) | `TEST-CARD-V2-RETEST-001` | CardID: 999998796299591; `RevalueCashBit: true` — use for revalue endpoint tests |
| Valid TaskLutId (Machine Fill) | `996231359` | From LutTypeID 675347903 (scheduler task type) |
| Valid TaskLutId (Cash Collection) | `996231358` | From LutTypeID 675347903 |
