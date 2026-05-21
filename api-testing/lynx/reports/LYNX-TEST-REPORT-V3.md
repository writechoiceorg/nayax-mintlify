# Nayax Lynx API — Test Report V3

**Dates:** 2026-05-21
**Tester:** Claude (automated via API calls), Anayse (WriteChoice)
**Sandbox:** https://qa-lynx.nayax.com
**Collection:** Bruno YAML collection at `api-testing/lynx/`
**OpenAPI spec:** `openapi/lynx.yaml`
**Previous report:** `reports/LYNX-TEST-REPORT-V2.md`

---

## 1. Summary

| Folder | Endpoints | Passed | Failed | Skipped | Notes |
|--------|-----------|--------|--------|---------|-------|
| Sign In | 2 | 2 | 0 | 0 | |
| Actors | 20 | 17 | 1 | 2 | Update Actor + Add/Update Machine Group fixed; Add Actor Group = Category C |
| Lookups | 18 | 17 | 1 | 0 | Get Regions 403 (Category A) |
| Devices | 4 | 2 | 2 | 0 | DeviceID=0, Move Devices silent fail |
| EReceipt | 1 | 0 | 1 | 0 | Category C — no transactions with valid date |
| Cards | 20 | 20 | 0 | 0 | Update Card Details and Transfer Revalue fixed; all cards passing |
| Machine Attribute | 7 | 7 | 0 | 0 | Update to Model Defaults confirmed passing |
| Machine Inventory | 6 | 5 | 1 | 0 | Update Pick List passing; Set All Bins confirmed blocked (no inventory) |
| Machine Products | 5 | 5 | 0 | 0 | |
| Machines | 15 | 13 | 0 | 2 | No device serials/VPOS in sandbox |
| Metadata | 2 | 0 | 2 | 0 | Both 403 |
| Payment | 4 | 0 | 4 | 0 | All Category B or permission-blocked |
| Product Groups | 9 | 4 | 5 | 0 | Tax 403; Add Actor Group Category C |
| Products | 4 | 4 | 0 | 0 | |
| Report | 2 | 2 | 0 | 0 | |
| Scheduling | 16 | 12 | 3 | 1 | 6 GETs/DELETE now passing; Category C blocks remaining writes |
| **TOTAL** | **135** | **110** | **20** | **5** | |

**Overall pass rate:** 110 / 130 tested = **85%** (up from 71% in V2)

---

## 2. What Changed Since V2

### Resolved by collection / doc fixes (Category D)

| Endpoint | Was | Now | Fix |
|----------|-----|-----|-----|
| PUT Update Card Details | 400 "The field CardPhysicalType is not valid" | 200 OK | Add `"CardPhysicalType": 2` to request body |
| POST Transfer Revalue | 400 "remarks required" | 200 `{"value":0.0200}` | Use `CreditChangeRemarks` query param; destination card must also have `RevalueCashBit: true` |
| PUT Update Actor | 400 "ActorTypeID must be operator or institute/customer type" | 200 OK | Send existing `ActorTypeID` from a prior GET, not `0` |
| POST Add Machine Group | Not tested | 200 OK | Confirmed working with `MachineGroupName` + `MachineGroupCode` in body |
| PUT Update Machine Group | 404 (ID in path) | 200 OK | `MachineGroupId` must be in the **body** — appending it to the path returns 404 |
| POST Update Attribute to Model Defaults | SKIP | 200 `{"Ok":true}` | Safe to run; resets machine attributes to model defaults |
| PUT Update Pick List | 500 (MachineId: 0) | 200 `[]` | Use valid MachineId; returns `[]` when no pick list items exist |

### Scheduling permissions unblocked

Six scheduling endpoints that previously showed 403 in collection examples now return 200. YAML examples updated:

| Endpoint | Was | Now |
|----------|-----|-----|
| GET `/v1/Scheduling/drivers` | 403 | 200 `[]` |
| GET `/v1/Scheduling/routes` | 403 | 200 `[]` |
| GET `/v1/Scheduling/schedule/machine-tasks` | 403 | 200 `[]` |
| DELETE `/v1/Scheduling/schedule/machine-tasks` | 403 | 200 (zeroed object on no-match) |
| GET `/v1/Scheduling/route-machines` | 403 | 200 `[]` (use `MachineId` or `RouteId` — not `OperatorId` alone) |
| GET `/v1/Scheduling/schedule/visit-order` | 403 | 200 `[]` |

**Note:** These were 403 in YAML examples from a prior test run. The current token has access to all scheduling read endpoints. Write endpoints remain blocked by missing sandbox data (no routes/drivers configured).

### Cards: all 20 endpoints now passing

Including the V3 fix for Transfer Revalue — both source and destination cards must have `RevalueCashBit: true`. See known-behaviors.md.

---

## 3. Current Failures

### Category A — Permission-gated (403)

| Endpoint | Folder | Ask |
|----------|--------|-----|
| GET Encryption Keys (`/v1/actors/GetEncKeys`) | Actors | Grant encryption role |
| PUT Generate Encryption Key (`/v1/actors/GenarateEncKey`) | Actors | Grant encryption role |
| PUT Decrypt Message (`/v1/actors/DecryptionMessageByVer`) | Actors | Grant encryption role |
| GET Event Rules (`/v1/metadata/v1/event-rules`) | Metadata | Grant metadata permission |
| POST Upload Picture (`/v1/metadata/upload-picture`) | Metadata | Grant metadata permission |
| GET/POST/PUT/DELETE Product Group Tax | Product Groups | Grant tax management permission |
| GET Regions (`/v1/regions`) | Lookups | Grant regions permission |
| POST Create Visit Orders (`/v1/Scheduling/schedule/visit-order`) | Scheduling | Write permission not granted |

**Total blocked by permissions: 10 endpoints**

---

### Category B — Server bugs

| Endpoint | Error | Details |
|----------|-------|---------|
| POST Create Machine Tasks | 500 "Oops, an error has occurred" | Fully valid payload (`MachineId=1002511581`, `TaskLutId=996231359`). `correlationId: rbycb2Bs0EqfCQMC`. No fix. |
| POST Approve Refund | 500 + internal URL | Leaks `http://qailapi01.nayaxvend.int:5064` (security issue). |
| GET Available Widgets `screenTypeId=0` | 500 leaks internal URL | `http://qailapi01.nayaxvend.int:6009` exposed. Use `screenTypeId=1`. |
| POST Add New Driver | 500 from downstream | `qailapi01.nayaxvend.int:5057` — server error after passing all field validation. Needs valid UserId. |

#### Key Findings — Category B

---

**Key Finding: POST Add New Driver — server error after field validation passes**

**What happens:**
```
POST /v1/Scheduling/drivers
Body: {
  "UserId": 1000294591,
  "OperatorId": 2009586082,
  "DriverStatusId": 1,
  "WorkingHours": [{"Day": 1, "StartTime": "08:00", "EndTime": "17:00"}]
}
HTTP 500
{
  "message": "The HTTP status code for url http://qailapi01.nayaxvend.int:5057/v1/drivers was not expected (Status code: 500)...",
  "correlationId": "TRNNVfJftUm4cGzF"
}
```
**Expected:** 200 with new driver record
**Actual:** 500 from downstream service. Earlier attempts revealed: `WorkingHours` must contain at least one element; each element requires a `Day` field (1-7). Field validation passes, but the `UserId` must reference a valid Nayax user account — `1000294591` causes a downstream 500.
**Doc implication:** Add Note: `WorkingHours` is required and must have at least one entry with `Day` (1-7). UserId must be a valid Nayax user. Also exposes internal hostname — Nayax to fix.

---

**Key Finding: GET Route Machines — OperatorId param ignored**

**What happens:**
```
GET /v1/Scheduling/route-machines?OperatorId=2009586082
HTTP 400
{"message":"You must insert at least one value for Route Id, Machine Id, or Operator Id"}
```
**Expected:** 200 with routes/machines for operator
**Actual:** `OperatorId` is silently ignored — despite the error message listing it as a valid param, only `RouteId` or `MachineId` are accepted.
**Doc implication:** Add Note: use `MachineId` or `RouteId` as the primary filter. `OperatorId` is listed in the error message but is not effective as a standalone param.

---

**Key Finding: API error typo — "Route is not fount"**

**What happens:**
```
GET /v1/Scheduling/route-machines?RouteId=1
HTTP 400
{"message":"Route is not fount"}
```
**Expected:** "Route is not found"
**Actual:** Consistent typo "fount" instead of "found" in the API error body. Appears in all route-not-found responses.
**Doc implication:** Note the typo when displaying this error to users. Nayax to fix the message string.

---

### Category C — Sandbox data / configuration gaps

| Issue | Blocked endpoint(s) | Ask |
|-------|--------------------|----|
| No real transactions in sandbox | POST /v1/ereceipt/generate | Need at least one real transaction |
| No `ActorBillingPlanID` configured | POST /v2/actors/{ParentActorID} | Configure at least one billing plan for sandbox |
| `DeviceID: 0` on all device records | GET/PUT /v1/devices/{DeviceID} | Clarify: is DeviceID populated in production? |
| No valid `UserId` for driver creation | POST /v1/Scheduling/drivers | Provide a valid UserId (not `1000294591` — causes downstream 500) |
| No routes in sandbox | GET /route-machines with RouteId; POST assign, DELETE remove | Create at least one test route in sandbox |
| Role groups not configured for actor | POST /v1/actors/{ActorID}/roleGroups | Returns 400 `create_actor_groups_not_allowed` — Nayax must configure available role groups for sandbox actor |

---

### Category D — Doc/collection gaps fixed this run

| # | Endpoint | What was wrong | Fix applied |
|---|----------|----------------|-------------|
| 1 | PUT Update Card Details | Missing `CardPhysicalType` field | Added `"CardPhysicalType": 2` to collection body |
| 2 | POST Transfer Revalue | Missing `CreditChangeRemarks` param; destination card had no revalue | Added query param; use revalue-capable card as destination |
| 3 | PUT Update Actor | Sending `ActorTypeID: 0` is invalid | GET actor first to read existing `ActorTypeID`; send that value |
| 4 | PUT Update Machine Group | Sending `MachineGroupId` in path segment returns 404 | Move `MachineGroupId` to body |
| 5 | POST Update Attribute to Model Defaults | Marked SKIP — safe to test | Confirmed 200 `{"Ok":true}` |
| 6 | PUT Update Pick List | Sending `MachineId: 0` caused 500 | Use valid `MachineId`; `Products: []` is accepted |
| 7 | Scheduling GET examples | YAML examples showed 403 from earlier run | Updated to 200 `[]` — these endpoints are accessible with current token |

---

## 4. Nayax Team Action List

### Blocking — cannot test without these

1. **Provide valid UserId for Add Driver** — `UserId` must be an actual Nayax user account linked to the sandbox operator. `1000294591` fails downstream.
2. **Create at least one route in sandbox** — Route creation is 403 for our token. Route Machines GET, Assign Machine, Remove Machine, Update Route all require an existing route.
3. **Configure role groups for sandbox actor** — POST `/v1/actors/{ActorID}/roleGroups` returns `create_actor_groups_not_allowed`. Nayax must configure which role groups are available for the sandbox operator.
4. **Sandbox transaction data** — eReceipt returns "Date is too old or invalid".
5. **Billing plan for sandbox** — Create New Actor v2 blocked until valid `ActorBillingPlanID` configured.
6. **Full Scheduling write permissions** — Create Visit Orders (POST) still returns 403.

### Server bugs to fix

7. **Approve Refund** — 500 + leaks `qailapi01.nayaxvend.int:5064` (security issue)
8. **Add New Driver** — 500 from downstream after field validation passes; leaks `qailapi01.nayaxvend.int:5057`
9. **Create Machine Tasks** — 500 on fully valid payload; no diagnostic besides correlation ID
10. **Request/Decline Refund** — return HTTP 200 wrapping logical failure; should be 4xx
11. **Upload Refund** — leaks internal hostname; downstream error says `FileData is empty`
12. **Get Available Widgets screenTypeId=0** — 500 leaks `qailapi01.nayaxvend.int:6009`

### API correctness / spec issues

13. **"Route is not fount" typo** — all route-not-found responses have this spelling error in the message body
14. **`OperatorId` ignored in GET Route Machines** — listed in error message but does not work as a filter
15. **Confirm Upload Refund field format** — is the body `FileData` (base64) or `FileURL`? Neither documented.
16. **DeviceID = 0 on all sandbox records** — is DeviceSerial the intended lookup key?
17. **eReceipt field name typos** — `TrasactionID` and `TrasactionSiteID` (missing 'n') confirmed in API

---

## 5. Our Open Items (docs)

| Item | File | Status |
|------|------|--------|
| `CardPhysicalType` required in PUT Update Card Details | `cards/create-cards.mdx` or separate update page | Needs update |
| Transfer Revalue: both cards must have `RevalueCashBit: true` | `cards/create-cards.mdx` | Needs Note |
| `CardDateRules` required for v2 card creation (misleading error) | `cards/create-cards.mdx` | Needs Warning |
| GET Route Machines: `OperatorId` not effective — use `MachineId` or `RouteId` | Scheduling docs | Needs Note |
| Update Machine Group: `MachineGroupId` goes in body, not path | Scheduling/operator guide | Needs clarification |
| Add New Driver: `WorkingHours` required; each entry needs `Day` (1-7) | Scheduling docs | Needs Note |
| `FileData` vs `FileURL` for upload-refund | Payment guide | Pending Nayax clarification |
| `screenTypeId` required in body for get-widget-data | Report/Dashboard guide | Needs creation |
| "Route is not fount" typo — flag to Nayax + warn users in docs | Scheduling docs | Pending Nayax fix |

---

## 6. Sandbox Reference Data

| Field | Value | Notes |
|-------|-------|-------|
| Sandbox base URL | `https://qa-lynx.nayax.com` | |
| Sandbox ActorID | `2009586082` | Use in all actor-scoped requests |
| Sandbox ActorCode | `1222` | Short reference for same actor |
| Test Sub-Actor (cleanup needed) | `2009706612` | "API-Test-Delete-Me", ActorCode 999901 |
| Parent Distributor ActorID | `2001312062` | Nayax Integrations |
| CountryID — actor endpoints | `840` | ISO numeric |
| CountryID — card/lookup endpoints | `225` | Nayax internal — required for card creation |
| CurrencyID | `3` | USD |
| Test NayaxProductID | `999998535696561` | |
| Valid SalesSourceID | `30000512` | Required for machine creation |
| Valid CardTypeID (prepaid) | `33` | |
| Valid CardPhysicalType (v1) | `2` | Swipe card — required in PUT Update Card Details |
| Valid PhysicalTypeID (v2) | `30000528` | |
| Valid PaymentMethodIDs | `1, 140, 141, 142, 168, 177, 245, 252, 264` | Full list for sandbox actor |
| Test MachineID | `1002511581` | Primary test machine |
| Test MachineID (payment-enabled) | `1002529791` | Has payment methods enabled |
| Test Card (standard prepaid) | `TEST-CARD-004` | CardID 999998796245511 — no revalue |
| Test Card (revalue-capable source) | `TEST-CARD-V2-RETEST-001` | CardID 999998796299591 — `RevalueCashBit: true` |
| Test Card (v1 created, CountryID 225) | `TEST-CARD-V2-005` | CardID 999998796306431 — `RevalueCashBit: true` (confirmed by transfer) |
| Valid TaskLutId (Machine Fill) | `996231359` | From `GET /v1/lookupTypes/675347903/values` |
| Valid TaskLutId (Cash Collection) | `996231358` | Same lookup type |
| MachineProductID (test machine) | `5293070291833924738` | Valid for machine products endpoints |
| Valid screenTypeId (dashboard) | `1` | `screenTypeId=0` causes 500 with URL leak |
| Test Machine Group ID | `1002953511` | "API-Test-Group-Updated" — created V3 |
| WorkingHours Day field | Integer 1–7 | Required per entry in Add Driver body |
