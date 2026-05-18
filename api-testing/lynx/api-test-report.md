# Nayax Lynx API — Test Report

**Dates:** 2026-05-13 to 2026-05-15
**Tester:** Anayse (WriteChoice)
**Sandbox:** https://qa-lynx.nayax.com
**Collection:** Bruno YAML collection at `api-testing/lynx/`
**OpenAPI spec:** `openapi/lynx.yaml`

---

## 1. Summary

| Folder | Endpoints | Passed | Failed | Skipped |
|--------|-----------|--------|--------|---------|
| Actors | 20 | 13 | 4 | 2 |
| Sign In | 2 | 2 | 0 | 0 |
| Lookups | 18 | 17 | 1 | 0 |
| Devices | 4 | 2 | 2 | 0 |
| EReceipt | 1 | 0 | 1 | 0 |
| Cards | 20 | 13 | 6 | 1 |
| Machine Attribute | 7 | 6 | 0 | 1 |
| Machine Inventory | 6 | 3 | 1 | 2 |
| Machine Products | 5 | 2 | 2 | 1 |
| Machines | 15 | 10 | 3 | 1 |
| Metadata | 2 | 0 | 2 | 0 |
| Payment / Refunds | 4 | 0 | 4 | 0 |
| Product Groups | 9 | 4 | 4 | 0 |
| Products | 4 | 4 | 0 | 0 |
| Report | 2 | 2 | 0 | 0 |
| Scheduling | 16 | 0 | 16 | 0 |
| Cards V2 / follow-up | 5 | 3 | 0 | 0 |
| **TOTAL** | **155** | **85** | **46** | **8** |

**Overall pass rate:** 85/147 tested = **58%** (excluding skipped)

---

## 2. What Worked

The following areas returned correct responses matching the documented structure:

- **Actors (reads):** Get Actor Hierarchy, Get Actor by ID, Get Actor by ActorCode, Get Actor Types, Search Actors, Get Machine Groups, Get Payment Methods, Get Sign-In Methods, Actor Groups (most), Actor Users — all returning expected 200 with correct shape
- **Sign In:** POST sign-in returns `{"ok":true}` and GET returns HTML page (both behave as expected once the intent of each endpoint was understood)
- **Lookups (17/18):** All reference data endpoints pass — countries, states, cities, currencies, time zones, languages, machine types, actor types, roles. Comprehensive and reliable reference layer.
- **Products (4/4):** Full CRUD works. Created test product NayaxProductID `999998535696561` in sandbox.
- **Machine Attribute (6/7):** Read and write defaults work; Update Model Defaults skipped to avoid sandbox reset.
- **Machine Inventory (reads):** Get pick lists, bins, and inventory history pass.
- **Machines (reads):** Get machines, get machine details, get machine statistics, get machine alerts, get machine logs — all pass with correct response shape.
- **Product Groups (creates/reads):** Create and get product groups pass. Delete works.
- **Cards (most reads):** Get card details, get card history, card search (with at least one param) all pass.
- **Report (2/2):** Dashboard widgets and report data pass once `screenTypeId` parameter was corrected.
- **Cards V2:** Create and Update pass with corrected field names and required credit limit fields.
- **Machine Products (reads):** Get machine products passes.

---

## 3. What Failed

### Category A — Permission-gated (403): Nayax team action required

These endpoints return `403 Insufficient permissions` with the sandbox token. The sandbox account does not have the required role or scope. **Nothing can be done on our side — Nayax must grant elevated permissions or configure the sandbox account.**

| Endpoint | Folder | Specific ask |
|----------|--------|-------------|
| Get Encryption Keys by ActorID | Actors | Grant encryption role to sandbox token |
| Generate Encryption Key | Actors | Grant encryption role to sandbox token |
| Decrypt Message by Encryption Version | Actors | Grant encryption role to sandbox token |
| Get Regions | Lookups | Grant region access or clarify minimum role |
| Generate eReceipt | EReceipt | Grant eReceipt permission to sandbox |
| GET/POST metadata/event-rules | Metadata | Grant metadata permission |
| POST metadata/upload-picture | Metadata | Grant metadata permission |
| Request Refund | Payment | Grant refund workflow permission |
| Approve Refund | Payment | Grant refund workflow permission |
| Decline Refund | Payment | Grant refund workflow permission |
| Upload Refund Documentation | Payment | Grant refund workflow permission |
| GET/POST/PUT/DELETE product group tax | Product Groups | Grant tax management permission |
| All 16 Scheduling endpoints | Scheduling | Grant scheduling/routing permission |

**Total blocked by permissions: 26 endpoints**

---

### Category B — Server bugs: Nayax team investigation required

These endpoints return server errors (500/400) that are caused by bugs or missing sandbox configuration, not by incorrect requests.

| Endpoint | Error | Details |
|----------|-------|---------|
| Get Operator EV Meter Dashboard | 500 on date range params | Null reference when StartDate/EndDate provided; also `TimePeriod=1` returns 400 with no valid value documented |
| Create New Machine | 500, no diagnostic | Even with values copied from existing machine; no structured error body to diagnose |
| Create/Update Payment Method for Machine | 400 `create_payment_method_not_available` | No payment methods enabled for sandbox operator |
| Update Pick List | 500 null reference | Crashes when `Products` array is empty; should return 400 |
| Get Available Widgets | 500 leaks internal URL | Response body contains `http://qailapi01.nayaxvend.int:6009` — internal hostname exposed (security issue) |
| eReceipt field names | API-level typo | `TrasactionID` / `TrasactionSiteID` — missing 'n' in both field names across spec and API |

---

### Category C — Sandbox data/configuration gaps: Nayax team setup required

| Issue | Blocked endpoint(s) | Ask |
|-------|--------------------|----|
| No `ActorBillingPlanID` configured for sandbox | Create New Actor v2 | Configure at least one billing plan for the sandbox account |
| DeviceID returns 0 for all records in listing | Get/Update Device by ID | Clarify: is DeviceID populated in production? Is DeviceSerial the intended lookup key? |
| No payment methods enabled for sandbox operator | Create/Update Machine Payment Methods | Enable at least one payment method (credit card or NFC) for sandbox |

---

### Category D — Spec vs. API discrepancies: Fixed during this test run

These issues were found and fixed locally. The collection and/or documentation have been updated on the `api-test` branch.

| # | Endpoint | What spec/docs said | What API actually requires/returns | Fix applied |
|---|----------|---------------------|------------------------------------|-------------|
| 1 | Get Actor by ActorCode | Example used `ActorID` value `2009586082` | Correct value is `ActorCode` = `1222` | Fixed: collection |
| 2 | Create Actor v2 | Field named `ActorStatus` | API requires `StatusID` | Fixed: collection |
| 3 | User Sign In | Credentials were hardcoded in YAML | Should use env vars | Fixed: collection |
| 4 | Get Cards | No params — request would always 400 | At least one query param required; spec does not state this | Fixed: collection + note in docs |
| 5 | Create Virtual Card | `CardType` and `CardStatus` field names | API uses `CardTypeID` = `33`, `CardPhysicalType` = `2`; both required but undocumented | Fixed: collection |
| 6 | Create New Card v2 / Update Card by ID v2 | Wrong field names `CardType`, `CardStatus`; no credit limit fields shown | API requires `CreditAmountDailyLimit`, `CreditAmountMonthlyLimit`, `CreditAmountMonthlyReload` | Fixed: collection |
| 7 | Get Credit Card Latest Transactions | Body format not specified | Body must be SHA1/base64 encoded string, not plain text | Fixed: collection |
| 8 | Create New Machine | `SalesSourceID` example value was `1` | `1` is invalid; valid value is `30000512` | Fixed: collection |
| 9 | Upload Refund Documentation | Body was empty in collection YAML | Body required | Fixed: collection |
| 10 | Report — Get Available Widgets | `screenTypeId=0` used in collection | `0` triggers 500; valid value is `1` | Fixed: collection |
| 11 | Create/Update Machine Products | `NayaxProductID` was null | Valid sandbox ID is `999998535696561` | Fixed: collection |
| 12 | Sign In — GET | Appeared as REST endpoint | Returns HTML web UI page, not an API response | Fixed: docs (note added to security.mdx) |
| 13 | Actors + Lookups | `CountryID` for actor endpoints vs. lookup endpoints | Actor endpoints use ISO numeric (`840`); lookup endpoints use internal ID (`225`) for same country | Fixed: docs (reference-data.mdx) |
| 14 | Scheduling | No documentation existed | Full scheduling section added | Fixed: docs (scheduling/ folder on api-test branch) |
| 15 | Error responses | No error handling reference | Error format documented | Fixed: docs (error-handling.mdx on api-test branch) |
| 16 | Reference data | No guide for enum values | Reference data guide added | Fixed: docs (reference-data.mdx on api-test branch) |
| 17 | Generate Encryption Key | URL in spec: `GenarateEncKey` | Correct URL is `GenerateEncKey` (typo in spec) | Fixed: openapi/lynx.yaml |

---

## 4. Consolidated Nayax Team Action List

### Blocking — cannot test without these

1. **Grant elevated permissions for sandbox token**: encryption endpoints (3), eReceipt (1), Metadata (2), Payment/Refunds (4), Scheduling (16), Regions (1) — 27 endpoints total blocked
2. **Enable at least one payment method** for the sandbox operator account (needed for machine payment method endpoints)
3. **Configure a valid `ActorBillingPlanID`** for the sandbox — currently blocks all v2 Actor creation
4. **Clarify DeviceID=0**: Is this a sandbox data quality issue or an API bug? If DeviceSerial is the intended key for single-device operations, document that

### Server bugs to fix

5. **Create New Machine (POST /v1/machines)**: Returns 500 with no diagnostic body; structured error response needed
6. **Update Pick List (PUT /v1/machines/inventory/picklists/update)**: Null reference on empty `Products` array — should return 400 with a clear message
7. **Get Operator EV Meter Dashboard**: 500 on date range params; document valid `TimePeriod` enum values
8. **Get Available Widgets**: Error response leaks internal hostname `qailapi01.nayaxvend.int` — strip internal URLs from error bodies (**security issue**)

### API correctness

9. **Fix field name typos in eReceipt API**: `TrasactionID` → `TransactionID` and `TrasactionSiteID` → `TransactionSiteID` (missing 'n' in both)
10. **Clarify `ProductGroupCode`**: Is it writable via API or managed internally? If read-only, mark as `readOnly: true` in the OpenAPI spec and remove from request body examples
11. **Confirm Metadata URL**: Is `/v1/metadata/v1/event-rules` (double version prefix) intentional or a bug that happens to work?
12. **Document enum values** for: `TimePeriod`, `SalesSourceID`, `MachineTypeID`, `CardType`, `CardPhysicalType` — currently none have valid value lists in the spec or docs

---

## 5. What Still Needs Attention (Our Side)

These are open items that were not yet fixed in this test round:

- `cards/create-cards.mdx`: Document v2 prepaid card required fields (`CreditAmountDailyLimit`, `CreditAmountMonthlyLimit`, `CreditAmountMonthlyReload`) and the `GroupLocationLimits` rule
- `cards/`: Add usage note for Get Credit Card Latest Transactions explaining SHA1/base64 body format
- `devices/`: Document empty array response on Move Devices (silent failure when serial doesn't match)
- `inventory-management/`: Document empty response body on Create Pick List
- Product Groups: Add note that `ProductGroupCode` may be silently ignored (pending Nayax clarification)
- Sign In GET endpoint: Remove from collection or clearly comment it is a web UI URL, not a REST endpoint

---

## 6. Sandbox Reference Data

Collected during testing for use in future test runs:

| Field | Value |
|-------|-------|
| Sandbox base URL | https://qa-lynx.nayax.com |
| Sandbox ActorID | 2009586082 |
| Sandbox ActorCode | 1222 |
| Parent Distributor ActorID | 2001312062 (Nayax Integrations) |
| CountryID (actor endpoint format) | 840 (United States, ISO numeric) |
| CountryID (lookup endpoint format) | 225 (United States, internal Nayax ID) |
| CurrencyID | 3 |
| Test NayaxProductID | 999998535696561 |
| Valid SalesSourceID | 30000512 |
| Valid CardTypeID (prepaid) | 33 |
| Valid CardPhysicalType | 2 |
| Valid PaymentMethodIDs | 1 (Credit Card), 2 (NFC), 3 (QR) |
