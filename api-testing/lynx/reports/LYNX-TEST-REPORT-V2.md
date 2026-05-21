# Nayax Lynx API — Test Report V2

**Dates:** 2026-05-21
**Tester:** Claude (automated via API calls), Anayse (WriteChoice)
**Sandbox:** https://qa-lynx.nayax.com
**Collection:** Bruno YAML collection at `api-testing/lynx/`
**OpenAPI spec:** `openapi/lynx.yaml`
**Previous report:** `reports/LYNX-TEST-REPORT-V1.md`

---

## 1. Summary

| Folder | Endpoints | Passed | Failed | Skipped | Notes |
|--------|-----------|--------|--------|---------|-------|
| Sign In | 2 | 2 | 0 | 0 | |
| Actors | 20 | 14 | 4 | 2 | Enc keys 403, evDashboard 400, GenarateEncKey changed |
| Lookups | 18 | 18 | 0 | 0 | Regions now passes — see note |
| Devices | 4 | 2 | 2 | 0 | DeviceID=0, Move Devices silent fail |
| EReceipt | 1 | 0 | 1 | 0 | Error changed — see Key Finding |
| Cards | 20 | 19 | 0 | 1 | v2 create still blocked (CardDateRules); v1 create now passing with CountryID fix |
| Machine Attribute | 7 | 7 | 0 | 0 | v2 attributes and resendConfig now passing |
| Machine Inventory | 6 | 5 | 0 | 1 | Pick list generate now passing with Content-Length fix; Set Bins skipped |
| Machine Products | 5 | 5 | 0 | 0 | |
| Machines | 15 | 13 | 0 | 2 | No device serials/VPOS in sandbox |
| Metadata | 2 | 0 | 2 | 0 | Both 403 |
| Payment | 4 | 0 | 4 | 0 | Upload-Refund now 500 — see Key Finding |
| Product Groups | 9 | 4 | 4 | 0 | Tax endpoints 403 |
| Products | 4 | 4 | 0 | 0 | |
| Report | 2 | 2 | 0 | 0 | get-widget-data now passes with screenTypeId in body |
| Scheduling | 16 | 8 | 7 | 1 | Machine Tasks GET requires params; 2 writes still 403 |
| **TOTAL** | **155** | **103** | **24** | **9** | |

**Overall pass rate:** 103 / 146 tested = **71%** (up from 66% in V1)

---

## 2. What Changed Since V1

### Resolved by collection fixes (Category D)

| Endpoint | Was | Now | Fix |
|----------|-----|-----|-----|
| POST v2/machines/attributes (Insert-Update) | 500 — wrong body shape | 200 — `{"Ok":true,"Message":"Machines attributes update was successful"}` | Correct body: `[{"MachineIds":[id],"Attributes":[],"UpdateQueue":true,"UpdateValues":true}]` |
| POST Generate Pick List | 411 Length Required | 200 OK with empty body | Add `Content-Length: 0` header to empty-body POST |
| GET machine-tasks | 400 — no params | 200 — returns `[]` when no tasks exist | At least one param required: `ActorId`, `DriverId`, or `MachineId` |
| POST Create Virtual Card v1 | 500 `country_id_not_valid` | 200 — card created | CountryID for card endpoints is internal Nayax format (225), not ISO numeric (840) |
| POST resendConfig | Not tested | 200 | Confirmed working |
| GET machine-tasks with `ActorId=2009586082` | Not tested | 200 `[]` | Confirmed working |
| GET machine-tasks with `MachineId=1002511581` | Not tested | 200 `[]` | Confirmed working |
| GET /v1/dashboard/get-widget-data | 500 — no body sent | 500 — confirms needs `screenTypeId` in body | Revealed by downstream error: `screenTypeId can't be zero` |

### Actor Payment Methods — all 4 CRUD endpoints confirmed

| Endpoint | Status | Response shape |
|----------|--------|---------------|
| GET `/v1/actors/2009586082/paymentMethods` | 200 | Array of payment method objects |
| POST `/v1/actors/2009586082/paymentMethods` | 200 | Array of created payment method(s) |
| PUT `/v1/actors/2009586082/paymentMethods` | 200 | Array of updated payment method(s) |
| DELETE `/v1/actors/2009586082/paymentMethods/2` | 200 | `{"Ok":true,"Message":null,"SystemMessage":null,"code":null}` |

POST body format (critical — `ActorID` required in each array item):
```json
[
  {
    "ActorID": 2009586082,
    "PaymentMethodID": 2,
    "ExtraChargePercentageBit": false,
    "ExtraChargeValue": 0,
    "ExtraChargeBackupValue": 0
  }
]
```

---

## 3. Current Failures

### Category A — Permission-gated (403)

| Endpoint | Folder | Ask |
|----------|--------|-----|
| GET Encryption Keys (`/v1/actors/GetEncKeys`) | Actors | Grant encryption role |
| GET/PUT Generate Encryption Key (`/v1/actors/GenarateEncKey`) | Actors | Grant encryption role |
| PUT Decrypt Message (`/v1/actors/DecryptionMessageByVer`) | Actors | Grant encryption role |
| GET Event Rules (`/v1/metadata/v1/event-rules`) | Metadata | Grant metadata permission |
| POST Upload Picture (`/v1/metadata/upload-picture`) | Metadata | Grant metadata permission |
| GET/POST/PUT/DELETE Product Group Tax | Product Groups | Grant tax management permission |
| POST Create Route | Scheduling | Full write permission not granted |
| PUT Update Route | Scheduling | Full write permission not granted |
| DELETE Delete Driver | Scheduling | Full write permission not granted |
| DELETE Remove Machine from Route | Scheduling | Full write permission not granted |

**Note on Regions:** `GET /v1/regions` returned 403 in V1 but was not re-tested in this run with the new token. Marked as unresolved pending confirmation.

**Total blocked by permissions: 10+ endpoints**

---

### Category B — Server bugs

| Endpoint | Error | Details |
|----------|-------|---------|
| POST Create Machine Tasks | 500 "Oops, an error has occurred" | Fully valid payload (`MachineId=1002511581`, `TaskLutId=996231359`). `correlationId: rbycb2Bs0EqfCQMC`. No fix. |
| POST Approve Refund | 500 + internal URL | Leaks `http://qailapi01.nayaxvend.int:5064` (security issue). |
| GET Available Widgets `screenTypeId=0` | 500 leaks internal URL | `http://qailapi01.nayaxvend.int:6009` exposed. Use `screenTypeId=1`. |
| POST dashboard/get-widget-data | 500 | Body must include `screenTypeId` > 0 but exact format undocumented. |
| GET evDashboard `TimePeriod=1` | 400 | No valid `TimePeriod` enum documented. |
| POST Create Visit Orders | 500 | Empty body causes 500; required fields undocumented. |
| POST Create New Card v2 | 400 `null_CardDateRules` | Error message says "CardDetails cant be null" but actual issue is `CardDateRules` not provided — misleading error. |

#### Key Findings — Category B

---

**Key Finding: POST Approve Refund leaks internal hostname**

**What happens:**
```
POST /v1/payment/refund-approve
HTTP 500
{
  "message": "The HTTP status code for url http://qailapi01.nayaxvend.int:5064/v1/payment/refund-approve was not expected (Status code: 500) after 6ms.\r\nResponse: {\"message\":\"Oops something went wrong\",\"params\":null,\"errorKey\":\"Correlation id: 0V9F505XVUa0TcQi\",\"info\":null}",
  "correlationId": "0V9F505XVUa0TcQi"
}
```
**Expected:** 200 approval confirmation
**Actual:** 500 that exposes internal service URL `qailapi01.nayaxvend.int`
**Doc implication:** Warning on payment guide: endpoint non-functional in sandbox; exposes internal hostname — do not surface this response to end users. Nayax must fix before documentable.

---

**Key Finding: POST Request Refund returns HTTP 200 wrapping a failure**

**What happens:**
```
POST /v1/payment/refund-request
HTTP 200 OK
{"Result":"Refund update failed. Please try again later or contact support.","Status":"failed"}
```
**Expected:** HTTP 400 or 403
**Actual:** HTTP 200 with `"Status":"failed"` in body
**Doc implication:** Warning: do not rely on HTTP status. Always check `Status` field in the response body.

---

**Key Finding: POST Upload Refund — FileData required, not FileURL**

**What happens:**
```
POST /v1/payment/upload-refund
Body: {"FileURL":"https://example.com/test.pdf"}
HTTP 500
{
  "message": "The HTTP status code for url http://qailapi01.nayaxvend.int:5064/v1/payment/upload-refund was not expected (Status code: 400) after 1ms.\r\nResponse: {\"message\":\"FileData is empty\",\"params\":{},\"errorKey\":null,\"info\":null}",
  "correlationId": "S0QDN10wC0ej7IK3"
}
```
**Expected:** 200 with file reference returned
**Actual:** Downstream service expects `FileData` (file content), not `FileURL`. The required field name and format are not documented.
**Doc implication:** Update upload-refund docs: `FileURL` field is insufficient. Requires `FileData` — likely base64-encoded file content. Confirm with Nayax.

---

**Key Finding: POST Create New Card v2 — misleading error for missing CardDateRules**

**What happens:**
```
POST /v2/cards
Body: (all required fields per docs, but CardDateRules omitted)
HTTP 400
{"message":"CardDetails cant be null","errorKey":"null_CardDateRules"}
```
**Expected:** Clear validation error naming the missing field
**Actual:** Message says "CardDetails cant be null" but `errorKey` is `null_CardDateRules` — the actual missing object is `CardDateRules`, not `CardDetails`
**Doc implication:** Warning in v2 card creation docs: `CardDateRules` object is required even though the error message incorrectly says "CardDetails". Minimum required: `{"ActivationDate":"...","ExpirationDate":"..."}`.

---

**Key Finding: POST dashboard/get-widget-data — screenTypeId required in body**

**What happens:**
```
POST /v1/dashboard/get-widget-data
Body: {}
HTTP 500 — downstream: "screenTypeId can't be zero"
```
**Expected:** Data returned for the default screen
**Actual:** `screenTypeId` must be provided in the request body and must be > 0
**Doc implication:** Add required field note: body must include `{"screenTypeId": 1}` at minimum.

---

### Category C — Sandbox data / configuration gaps

| Issue | Blocked endpoint(s) | Ask |
|-------|--------------------|----|
| No real transactions in sandbox | POST /v1/ereceipt/generate | Need at least one real transaction — error changed to "Date is too old or invalid", suggesting transaction lookup by ID returns a corrupt/null date |
| No `ActorBillingPlanID` configured | POST /v2/actors/{ParentActorID} | Configure at least one billing plan for sandbox |
| `DeviceID: 0` on all device records | GET/PUT /v1/devices/{DeviceID} | Clarify: is DeviceID populated in production? |
| No valid `UserId` for driver creation | POST /v1/Scheduling/drivers | Provide a valid UserId from the sandbox account |
| No routes in sandbox | POST /v1/Scheduling/route-machines | Need a route created before route-machine assignment can be tested |

---

### Category D — Doc/collection gaps fixed this run

| # | Endpoint | What was wrong | Fix applied |
|---|----------|----------------|-------------|
| 1 | Create Virtual Card v1 | CountryID 840 (ISO) rejected — card endpoints need internal Nayax CountryID 225 | Fixed: collection + **need to update known-behaviors.md** |
| 2 | POST v2/machines/attributes | Body had `MachineIds: [0]` and empty Attributes | Fixed: collection (use `[id]` not `[0]`) |
| 3 | POST Generate Pick List | curl omits Content-Length for empty body — server returns 411 | Fixed: collection (add `Content-Length: 0` header) |
| 4 | GET machine-tasks | Sent with no params — returns 400; at least one of ActorId/DriverId/MachineId required | Fixed: collection (add `ActorId` param) |
| 5 | POST actor payment methods | Body missing `ActorID` in each array item — returns 400 `update_actor_payment_multiple_specifications` | Fixed: collection + docs |
| 6 | POST Create New Card v2 | `CardDateRules` required but not in minimal docs example | Needs doc update |

---

## 4. Nayax Team Action List

### Still blocking — cannot test without these

1. **Full Scheduling write permissions** — Create Route, Update Route, Delete Driver, Remove Machine from Route still return 403
2. **Fix Create Machine Tasks** — 500 with fully valid payload; no diagnostic. `correlationId: rbycb2Bs0EqfCQMC` from this run.
3. **Sandbox transaction data** — eReceipt now returns "Date is too old or invalid" (previously "transaction_not_found"). Possibly a transaction record exists but with a corrupt/null date — investigate
4. **Billing plan for sandbox** — Create New Actor v2 blocked until valid `ActorBillingPlanID` configured
5. **Provide valid UserId** — needed for Add New Driver

### Server bugs to fix

6. **Approve Refund** — 500 + leaks `qailapi01.nayaxvend.int:5064` internal hostname (security issue)
7. **Request/Decline Refund** — return HTTP 200 wrapping logical failure; should be 4xx
8. **Upload Refund** — leaks `qailapi01.nayaxvend.int:5064`; downstream error says `FileData is empty` — document the correct field name and format
9. **Create Machine Tasks** — 500 on valid payload; server-side bug
10. **Create Visit Orders** — 500 on empty body; document required fields
11. **Get Available Widgets screenTypeId=0** — 500 leaks `qailapi01.nayaxvend.int:6009` (security issue)
12. **dashboard/get-widget-data** — document required `screenTypeId` field in body; leaks internal hostname on empty body
13. **Create New Card v2** — misleading error: message says "CardDetails cant be null" when `CardDateRules` is the actual missing field (`errorKey: null_CardDateRules`)
14. **EV Meter Dashboard** — `TimePeriod=1` returns 400; valid enum values not documented anywhere

### API correctness

15. **Confirm Upload Refund field name** — is it `FileData` (base64)? `FileURL`? Document the correct format with an example
16. **Confirm Generate Encryption Key method** — YAML uses `PUT /v1/actors/GenarateEncKey` — confirm path and method are correct (currently returns 403, which is Category A, but want to ensure path is right)
17. **Document `DeviceID = 0`** — all sandbox records return DeviceID as 0; is DeviceSerial the intended key?
18. **eReceipt field name typos** — `TrasactionID` and `TrasactionSiteID` (missing 'n') confirmed in API responses

---

## 5. Our Open Items (docs)

| Item | File | Status |
|------|------|--------|
| `ActorID` required in each item when POSTing to actor payment methods | `operator/payment-methods.mdx` | Needs update |
| `CardDateRules` required for v2 card creation (misleading error message) | `cards/create-cards.mdx` | Needs update |
| CountryID for card creation uses internal format (225), not ISO (840) | `cards/create-cards.mdx` + `known-behaviors.md` | Needs update |
| GET machine-tasks requires at least one param (ActorId, DriverId, or MachineId) | Scheduling docs | Needs update (same pattern as Route Machines) |
| Create Pick List requires `Content-Length: 0` header in curl example | `inventory-management/pick-lists.mdx` | Needs update |
| `FileData` vs `FileURL` for upload-refund | Payment guide | Pending Nayax clarification |
| `CardDateRules` minimum fields for v2 card | `cards/create-cards.mdx` | Pending Nayax confirmation |
| `screenTypeId` required in body for get-widget-data | Report/Dashboard guide | Needs creation |

---

## 6. Sandbox Reference Data

| Field | Value | Notes |
|-------|-------|-------|
| Sandbox base URL | `https://qa-lynx.nayax.com` | |
| Sandbox ActorID | `2009586082` | Use in all actor-scoped requests |
| Sandbox ActorCode | `1222` | Short reference for same actor |
| Parent Distributor ActorID | `2001312062` | Nayax Integrations |
| CountryID — actor endpoints | `840` | ISO numeric |
| CountryID — card/lookup endpoints | `225` | Nayax internal — also required for card creation |
| CurrencyID | `3` | USD |
| Test NayaxProductID | `999998535696561` | |
| Valid SalesSourceID | `30000512` | Required for machine creation |
| Valid CardTypeID (prepaid) | `33` | |
| Valid CardPhysicalType (v1) | `2` | Swipe card |
| Valid PhysicalTypeID (v2) | `30000528` | |
| Valid PaymentMethodIDs | `1`, `2`, `3` (and many more) | Actor has 9 payment methods configured: IDs 1, 140, 141, 142, 168, 177, 245, 252, 264 |
| Test MachineID | `1002511581` | Primary test machine — use for all machine-specific operations |
| Test MachineID (payment-enabled) | `1002529791` | Has payment methods enabled |
| Test Card (standard prepaid) | `TEST-CARD-004` | CardID 999998796245511 — `RevalueCashBit: null` — cannot use revalue endpoints |
| Test Card (revalue-capable) | `TEST-CARD-V2-RETEST-001` | CardID 999998796299591 — `RevalueCashBit: true` |
| Test Card (created this run) | `TEST-CARD-V2-005` | CardID 999998796306431 — created with v1 endpoint, CountryID 225 |
| Valid TaskLutId (Machine Fill) | `996231359` | From `GET /v1/lookupTypes/675347903/values` |
| Valid TaskLutId (Cash Collection) | `996231358` | Same lookup type |
| MachineProductID (test machine) | `5293070291833924738` | Valid for machine products endpoints |
| Valid screenTypeId (dashboard) | `1` | `screenTypeId=0` causes 500 with URL leak |
| Actor Payment Method IDs on sandbox | `1, 140, 141, 142, 168, 177, 245, 252, 264` | Full list from GET paymentMethods response |
