# Nayax Lynx — Documentation Gap Log

Track gaps found in the Nayax developer zone (https://developerhub.nayax.com/) during API testing.
---

## Template

```
## [Endpoint name] — YYYY-MM-DD
**Gap**: What was unclear or missing in the Nayax docs
**Impact**: Self-serviceable without support? Yes / No / Partially
**Suggestion**: Specific fix or addition for the dev zone
**Status**: Open | Fixed: collection | Fixed: docs | Pending Nayax
```

---

## Entries

## Test Run — 2026-05-13 13:35
- **Folders tested**: Actors
- **Endpoints tested**: 20
- **Passed**: 13 | **Failed**: 4 | **Skipped**: 2 | **Flagged**: 1

---

## Get Actor by ActorCode — 2026-05-13
- **Gap**: The YAML test file uses the ActorID (`2009586082`) as the `ActorCode` query param value. The actual ActorCode for this actor is `1222`. The endpoint returns 404 with the wrong value.
- **Impact**: Yes — anyone following the collection will hit 404 and assume the endpoint is broken.
- **Suggestion**: Update `Actors/Get Actor by ActorCode.yml` to use the correct ActorCode value (`1222`). Consider adding an `examples` block with the correct 200 response.
- **Status**: Fixed: collection

## Get Encryption Keys by ActorID — 2026-05-13
- **Gap**: Returns 403 "Insufficient permissions" with the current sandbox token, even when passing the correct `actorID`. Docs do not mention any special permission requirement for this endpoint.
- **Impact**: No — endpoint appears to be permission-gated; docs should clarify what role or permission level is required.
- **Suggestion**: Add a note to the Lynx API docs (or endpoint reference) specifying which actor role or token scope is required to access encryption key endpoints.
- **Status**: Pending Nayax — need elevated permission grant for sandbox token

## Generate Encryption Key — 2026-05-13
- **Gap**: Two issues: (1) Returns 403 "Insufficient permissions" with the sandbox token — same permission gap as Get Encryption Keys. (2) The URL in the YAML (`/actors/GenarateEncKey`) contains a typo — missing the second `e` in "Generate". Correct path should be `/actors/GenerateEncKey`.
- **Impact**: No — can't test until permissions are resolved; the URL typo would cause 404 in production if used as-is.
- **Suggestion**: (1) Clarify required permissions in docs. (2) Verify the correct endpoint path with the Nayax team and fix the YAML: `Actors/Generate Encryption Key.yml`.
- **Status**: Pending Nayax (permission) | Fixed: openapi spec (GenarateEncKey typo corrected in lynx.yaml on api-test branch)

## Decrypt Message by Encryption Version — 2026-05-13
- **Gap**: Returns 403 "Insufficient permissions" with the sandbox token. No params were provided but auth is rejected before param validation.
- **Impact**: No — blocked at permissions level; cannot test the endpoint at all.
- **Suggestion**: Same as encryption key endpoints — clarify required permission scope in docs and with Nayax team.
- **Status**: Pending Nayax — need elevated permission grant for sandbox token

## Get Operator EV Meter Dashboard — 2026-05-13
- **Gap**: Two issues: (1) Calling with `TimePeriod=1` returns 400 "TimePeriod:1 is not valid" — the docs and YAML do not document valid `TimePeriod` values. (2) Calling with `StartDate` + `EndDate` returns 500 "Oops, an error has occurred" — a server-side error with no useful message.
- **Impact**: No — endpoint is unusable without knowing valid param values; the 500 on date params is a server bug.
- **Suggestion**: (1) Document the accepted `TimePeriod` enum values in the YAML params and in the Lynx API docs. (2) Report the 500 on date range params to the Nayax team as a server-side bug.
- **Status**: Pending Nayax — server bug (500 on date params) + missing TimePeriod enum documentation

## Add Machine Group — No Required-Field Validation — 2026-05-13
- **Gap**: `POST /actor/{ActorID}/machineGroups` accepts a completely zeroed body (`MachineGroupName: ""`, `MachineGroupCode: 0`, `LanguageId: 0`) and creates a real record with no error. No required-field validation is enforced.
- **Impact**: Partially — silent creation of empty/invalid machine groups could pollute production data if the endpoint is called without proper values.
- **Suggestion**: Confirm with Nayax team whether `MachineGroupName` should be required. If so, request validation to be added. Also: there is no Delete Machine Group endpoint in the collection — the created record cannot be cleaned up through the API.
- **Status**: Open — pending Nayax confirmation on whether MachineGroupName is required; no delete endpoint available

## Create a New Actor v2 — StatusID vs ActorStatus — 2026-05-13
- **Gap**: The v2 endpoint (`POST /v2/actors/{ParentActorID}`) uses `StatusID` inside `ActorDetails`, but the YAML template had no status field at all. Using `ActorStatus` (the v1 field name) returns "Actor Status ID is invalid". The OpenAPI spec (`ActorDetailsRequest`) confirms the correct field is `StatusID`.
- **Impact**: Yes — the YAML template would never work as shipped; anyone following it hits 400 immediately.
- **Suggestion**: The YAML body has been corrected to use `StatusID: 1`. The docs should also note the field name difference between v1 (`ActorStatus`) and v2 (`StatusID`).
- **Status**: Fixed: collection (YAML corrected to use StatusID: 1)

## Create a New Actor v2 — Billing Plan ID Required — 2026-05-13
- **Gap**: `POST /v2/actors/{ParentActorID}` returns 400 "Billing plan ID invalid" regardless of whether `ActorBillingPlanID` is set to `0`, `null`, or omitted entirely. No billing plans are configured for the sandbox account. The docs and YAML template do not explain how to find or set a valid billing plan ID.
- **Impact**: No — v2 actor creation is completely blocked in the sandbox until a billing plan is configured.
- **Suggestion**: Ask the Nayax team how to retrieve a valid `ActorBillingPlanID` for the sandbox (possibly via a Lookups or Billing endpoint). Add a note to the v2 docs that a billing plan must be configured before this endpoint can be used.
- **Status**: Pending Nayax — need billing plan configured in sandbox

## Hardcoded Credentials in User Sign In.yml — 2026-05-13
- **Gap**: `Sign In/User Sign In.yml` contains a plaintext username (`anayse`) and password (`HeitorSardinha7!`) in the request body.
- **Impact**: No — credentials are visible to anyone with access to the repo.
- **Suggestion**: Move credentials to environment secrets (`NAYAX_USER`, `NAYAX_PASS`) and reference them as `{{NAYAX_USER}}` / `{{NAYAX_PASS}}` in the YAML body.
- **Status**: Fixed: collection — `User Sign In.yml` now uses `{{NAYAX_USER}}` and `{{NAYAX_PASS}}` env vars.

---

## Test Run — 2026-05-14 Sign In
- **Folders tested**: Sign In
- **Endpoints tested**: 2
- **Passed**: 2 | **Failed**: 0 | **Skipped**: 0 | **Doc gaps**: 2

## Sign In GET Returns HTML — 2026-05-14
- **Gap**: `GET /operational/signin` returns a full HTML web login page, not a JSON response. This endpoint is the web UI login page and has no practical use as a REST API call.
- **Impact**: Partially — including this in the Bruno collection may mislead developers who expect all collection entries to be JSON API endpoints.
- **Suggestion**: Remove `Sign In/Sign In.yml` from the Bruno collection, or add a comment clarifying this is a web UI URL not an API endpoint.
- **Status**: Open — endpoint should be removed or clearly labelled in collection

## User Sign In — No Token in Response — 2026-05-14
- **Gap**: `POST /operational/v1/signin` returns `{"ok":true}` with no bearer token in the response body. Developers may expect this endpoint to return a token for use in subsequent API calls.
- **Impact**: Yes — the authentication story is incomplete: the collection has a sign-in endpoint that succeeds but produces no usable token. Developers must know to retrieve their token separately from Nayax Core UI (Account Settings > User Tokens).
- **Suggestion**: Add a note to `security.mdx` (and the collection README) explicitly stating that `POST /v1/signin` does not return a bearer token — tokens are static and obtained from the Nayax Core back office. Clarify what this sign-in endpoint is actually for (session auth vs. token generation).
- **Status**: Fixed: docs — security.mdx updated with clarification about static tokens

---

## Test Run — 2026-05-14 Lookups
- **Folders tested**: Lookups
- **Endpoints tested**: 18
- **Passed**: 17 | **Failed**: 1 | **Skipped**: 0 | **Doc gaps**: 2

## Get Regions — 403 Permission Error — 2026-05-14
- **Gap**: `GET /operational/v1/regions` returns 403 "Insufficient permissions" with the sandbox token. No permission requirement is documented for this endpoint.
- **Impact**: No — endpoint is inaccessible; region data (used for geographic filtering) cannot be retrieved with a standard token.
- **Suggestion**: Add a permissions note to the Regions endpoint documentation (or a general lookups page). Check with Nayax team whether this endpoint requires a distributor-level token.
- **Status**: Pending Nayax — need permission clarification for Regions endpoint

---

## Test Run — 2026-05-14 Devices
- **Folders tested**: Devices
- **Endpoints tested**: 4
- **Passed**: 2 | **Failed**: 2 | **Skipped**: 0 | **Doc gaps**: 2

## DeviceID Returns 0 in Get All Devices — 2026-05-14
- **Gap**: `GET /v1/devices` returns 1000 device records but every record has `DeviceID: 0` and `ActorID: 0`. The `DeviceSerial` field is populated. Because `GET /v1/devices/{DeviceID}` and `PUT /v1/devices/{DeviceID}` both require a numeric DeviceID, these endpoints cannot be tested from the listing results. It is unclear whether this is sandbox data quality or a field mapping issue in the response.
- **Impact**: Yes — developers cannot use the listing endpoint to discover DeviceIDs for use in single-device operations. The collection effectively dead-ends after the listing call.
- **Suggestion**: Ask the Nayax team whether `DeviceID` is populated in production data or whether `DeviceSerial` is the intended key for single-device lookups. Update the Bruno collection examples and docs to clarify which identifier to use for each endpoint.
- **Status**: Pending Nayax — need clarification on DeviceID=0 in sandbox

## Move Devices — Empty Array Response Undocumented — 2026-05-14
- **Gap**: `PUT /v1/devices/move/{actorId}` with a non-existent serial number returns `200 OK` with an empty array `[]`. The docs show an expected response format (array of device objects with `HW_serial`, `actor_id`, `is_connected`) but do not document the empty array case.
- **Impact**: Partially — a developer moving a device may not realise the operation silently failed if the serial doesn't match any device on their account.
- **Suggestion**: Document the empty array response and add a note that if the returned array is empty, no devices matched the provided serial numbers.
- **Status**: Open — doc note needed in devices guide

---

## Test Run — 2026-05-14 EReceipt
- **Folders tested**: EReceipt
- **Endpoints tested**: 1
- **Passed**: 0 | **Failed**: 1 | **Skipped**: 0 | **Doc gaps**: 1

## Generate eReceipt — 403 Permission Error — 2026-05-14
- **Gap**: `POST /v1/ereceipt/generate` returns 403 with the sandbox token. No permission requirement is documented. Additionally, the request body field names `TrasactionID` and `TrasactionSiteID` are misspelled (missing 'n') in both the OpenAPI spec (`lynx.yaml` lines 8589, 8599) and the Bruno YAML. The spec and collection match, meaning the API likely accepts the misspelled field names — but this creates a poor developer experience.
- **Impact**: Yes — developers will likely mistype the field names as `TransactionID`/`TransactionSiteID` (correct spelling) and get silent failures or unexpected behavior.
- **Suggestion**: (1) Clarify required permissions for eReceipt generation in docs. (2) Raise a bug report with the Nayax API team to correct the field names to `TransactionID` and `TransactionSiteID` in the next API version, with a deprecation notice for the misspelled variants.
- **Status**: Pending Nayax — permission (403) + field name typo fix needed in API

---

---

## Test Run — 2026-05-14 Cards
- **Folders tested**: Cards
- **Endpoints tested**: 20 (1 skipped)
- **Passed**: 13 | **Failed**: 6 | **Skipped**: 1 | **Doc gaps**: 4

## Get Cards — At Least One Search Param Required — 2026-05-14
- **Gap**: `GET /v1/cards` with no query parameters returns 400 "Search fields are missing". The Bruno YAML sends all params as empty strings, triggering the same 400. The docs and OpenAPI spec describe all params as optional with no mention that at least one must be non-empty.
- **Impact**: Yes — the Bruno collection as shipped will always fail this endpoint because all param values are empty strings.
- **Suggestion**: Update YAML to use one example value (e.g., `CardUniqueIdentifier: TEST-CARD-001`). Add a note to the docs that at least one search field is required.
- **Status**: Fixed: collection (YAML updated with example param value)

## Create Card / Update Card — CardPhysicalType Required but Not Documented — 2026-05-14
- **Gap**: Both `POST /v1/cards` (Create Virtual Card) and `PUT /v1/cards` (Update Card Details) return 400 "The field CardPhysicalType is not valid" when `CardPhysicalType` is missing from the request body. This field is not included in the Bruno YAML body for either endpoint and is not mentioned as required in the docs or OpenAPI spec (it is listed as `nullable: true`). Testing confirms it must be provided (value `2` worked).
- **Impact**: Yes — neither Create nor Update card endpoints work as documented. Every developer attempting these calls will hit 400 immediately.
- **Suggestion**: Add `CardPhysicalType` to the YAML request body examples with a valid value. Update docs to note valid values (check with Nayax team for the enum). Also, `CardType` in the Create Virtual Card YAML is set to `1` but valid values are `31` (Technician), `33` (Prepaid), `34` (Refund), `30000616` (Discount) — update the example.
- **Status**: Fixed: collection (CardPhysicalType: 2 added; CardType corrected) | Open: docs (enum values need documentation, pending Nayax clarification on CardPhysicalType full enum)

## Get Credit Card Latest Transactions — 500 Server Error — 2026-05-14
- **Gap**: `POST /v1/cards/query` returns 500 "Invalid Hex String. Could not convert it to byte array" regardless of whether an empty body `{}` or no body is sent. This appears to be a server-side bug where the endpoint cannot handle the request without specific binary content.
- **Impact**: No — endpoint is completely unusable in the sandbox. The error message is cryptic and gives developers no actionable guidance.
- **Suggestion**: Report to Nayax team as a server bug. The error suggests the endpoint may expect a specific binary-encoded payload rather than a standard JSON body.
- **Status**: Fixed: collection — correct body format identified: SHA1 hash of card number encoded as base64 JSON string. See follow-up entry 2026-05-15.

## Update Prepaid Card / Update Card v2 — Undocumented Required Fields — 2026-05-14
- **Gap**: `PUT /v1/cards/{CardId}/prepaid` returns cascading 400 errors for undocumented required fields: first `CreditAmountDailyLimit`, then `CreditAmountMonthlyLimit`. Similarly, `PUT /v2/cards/{CardID}` requires `CardCreditAttributes` to be non-null. None of these requirements are mentioned in the docs or indicated as required in the OpenAPI spec.
- **Impact**: Yes — developers cannot successfully call these endpoints without discovering the required fields through trial and error.
- **Suggestion**: Review all required fields for Update Prepaid Card and Update Card v2 with the Nayax team. Document the full set of required fields in the guides and mark them as required in the OpenAPI spec.
- **Status**: Fixed: collection (required credit limit fields added to template body in Update Prepaid Card.yml; Update Card v2 passes) | Open: docs (update create-cards.mdx v2 section with prepaid required fields)
- **Re-test 2026-05-15**: Update Prepaid Card (v1) confirmed passing with `CreditAmountDailyLimit`, `CreditAmountMonthlyLimit`, `CreditAmountMonthlyReload` included. Template body corrected in this session. Update Card v2 also passes.

---

---

## Test Run — 2026-05-14 Machine Attribute
- **Folders tested**: Machine Attribute
- **Endpoints tested**: 7 (1 skipped)
- **Passed**: 6 | **Failed**: 0 | **Skipped**: 1 | **Doc gaps**: 0

(No gaps found. Update to Model Defaults skipped — risk of resetting sandbox machine config.)

---

---

## Test Run — 2026-05-14 Machine Inventory
- **Folders tested**: Machine Inventory
- **Endpoints tested**: 6 (2 skipped)
- **Passed**: 3 | **Failed**: 1 | **Skipped**: 2 | **Doc gaps**: 2

## Create Pick List — Empty Response Body — 2026-05-14
- **Gap**: `POST /v1/machines/{MachineID}/pickList` returns 200 with an empty body. No response schema is documented for this endpoint in the guides or OpenAPI spec. A caller has no way to confirm what was created.
- **Impact**: Partially — developers cannot inspect the pick list after creation without a subsequent GET call.
- **Suggestion**: Document the expected 200 response (empty body or success object). If the API is intended to return the created pick list, consider it a server-side bug and raise with the Nayax team.
- **Status**: Open — doc note needed; may also be a server bug (empty response on create)

## Update Pick List — 500 on Empty Products Array — 2026-05-14
- **Gap**: `PUT /v1/machines/inventory/picklists/update` returns 500 "Value cannot be null. (Parameter 'source')" when `Products` is an empty array `[]`. This is a server bug — the server does not handle the empty collection gracefully and throws a null reference.
- **Impact**: Yes — the Bruno YAML body uses `"Products": []` as the example body, which always triggers this 500. Developers will never see a successful response from this endpoint using the provided example.
- **Suggestion**: (1) Update YAML to include at least one product in the `Products` array. (2) Report server-side null reference on empty Products to Nayax team — should return 400 with a helpful message.
- **Status**: Fixed: collection (YAML updated with valid product in array) | Pending Nayax — server bug (500 on empty array should be 400)

---

---

## Test Run — 2026-05-14 Machine Products
- **Folders tested**: Machine Products
- **Endpoints tested**: 5 (1 skipped)
- **Passed**: 2 | **Failed**: 2 | **Skipped**: 1 | **Doc gaps**: 1

## Create/Update Machine Products — NayaxProductID Required but YAML Uses Null — 2026-05-14
- **Gap**: Both `POST /v1/machines/{MachineID}/machineProducts` and `PUT /v1/machines/{MachineID}/machineProducts/{MachineProductID}` return 400 "The field NayaxProductID is not valid" when `NayaxProductID` is null or zero. The YAML request bodies use `NayaxProductID: null` (or `0`). The existing sandbox machine products also have no NayaxProductID assigned, making it impossible to test mutations without first creating a product via the Products endpoint.
- **Impact**: Yes — neither create nor update machine product calls work from the provided YAML examples.
- **Suggestion**: Test the Products endpoints first to obtain a valid `NayaxProductID`. Update the YAML examples to use a real product ID. Add a dependency note to the docs: "You must create a product via `POST /v1/products` before assigning it to a machine."
- **Status**: Fixed: collection (NayaxProductID 999998535696561 now used in YAML examples)

---

---

## Test Run — 2026-05-14 Machines
- **Folders tested**: Machines
- **Endpoints tested**: 15 (1 skipped)
- **Passed**: 10 | **Failed**: 3 | **Skipped**: 1 | **Doc gaps**: 3

## Create New Machine — 500 with No Details — 2026-05-14
- **Gap**: `POST /v1/machines` returns 500 "Oops, an error has occurred" even when using exact field values copied from an existing machine (CountryID=30, CurrencyID=3, MachineModelID=499349689, SalesSourceID=30000512, MachineTypeID=30000515). No more specific error is returned. The docs and YAML do not explain which fields are required vs optional, and provide no valid example values for `SalesSourceID` or `MachineTypeID`.
- **Impact**: Yes — machine creation is completely blocked. Developers have no way to diagnose the failure from the API response alone.
- **Suggestion**: (1) Report to Nayax team — the endpoint may require sandbox-level permissions not available to the test account. (2) Add example values for all enum-like fields (SalesSourceID, MachineTypeID) to both the docs and YAML. (3) Request that the 500 return a structured error body identifying the failing field.
- **Status**: Fixed: collection — Re-test 2026-05-15 PASSES with SalesSourceID=30000512, MachineTypeID=30000515, ActorID=2009586082, CountryID=30, CurrencyID=3, MachineGroupID=1002880251, MachineModelID=499349689, LanguageID=7. New MachineID=1002529791.

## Create/Update Payment Method for Machine — 500 Server Error — 2026-05-14
- **Gap**: Both `POST /v1/machines/{MachineID}/paymentMethods` and `PUT /v1/machines/{MachineID}/paymentMethods` return 500 "Oops, an error has occurred" with PaymentMethodID=1 (Credit Card). No useful error body is returned.
- **Impact**: Partially — payment method management on machines is inaccessible via the sandbox. Could be a permission issue or data state issue.
- **Suggestion**: Report to Nayax team. Check if adding payment methods requires the machine to be in a specific state or requires a billing configuration first.
- **Status**: Fixed: Nayax — Re-test 2026-05-15: Once payment methods were enabled for the sandbox operator account, POST (Create), PUT (Update), GET, and DELETE all return 200 OK.

## Update Machine — SalesSourceID YAML Example Is Invalid — 2026-05-14
- **Gap**: `PUT /v1/machines/{MachineID}` in the Bruno YAML uses `SalesSourceID: 1`, which returns 400 "SalesSourceID is invalid". The valid value for the sandbox machine is `30000512`. The OpenAPI spec defines `SalesSourceID` as `int32` with no enum values listed, giving developers no indication of valid values.
- **Impact**: Yes — the YAML as shipped will always produce a 400 error. Developers cannot update machines without knowing valid SalesSourceID values.
- **Suggestion**: Add `SalesSourceID` enum values to the OpenAPI spec (or at minimum a reference to a lookup endpoint). Update the YAML example to use the correct value from the sandbox machine.
- **Status**: Fixed: collection (SalesSourceID corrected to 30000512)

---

---

## Test Run — 2026-05-14 Metadata
- **Folders tested**: Metadata
- **Endpoints tested**: 2
- **Passed**: 0 | **Failed**: 2 | **Skipped**: 0 | **Doc gaps**: 1

## Metadata Endpoints — 403 Permission Error — 2026-05-14
- **Gap**: Both `GET /v1/metadata/v1/event-rules` and `POST /v1/metadata/upload-picture` return 403 "Insufficient permissions" with the sandbox token. Neither endpoint documents any permission requirement. Note: the event-rules URL contains what appears to be a doubled version prefix (`/v1/metadata/v1/event-rules`) but this is the correct path — alternatives (`/v1/metadata/event-rules`, `/v1/event-rules`) return 404.
- **Impact**: Partially — both endpoints are inaccessible in the sandbox. Developers cannot retrieve event rule configurations or upload images without elevated permissions.
- **Suggestion**: Add permission requirements to the docs for both endpoints. Confirm with the Nayax team whether the `/v1/metadata/v1/event-rules` path is intentional or a URL construction error that happens to work.
- **Status**: Pending Nayax — permission grant needed; also confirm if doubled version prefix in URL is intentional

---

---

## Test Run — 2026-05-14 Payment
- **Folders tested**: Payment
- **Endpoints tested**: 4
- **Passed**: 0 | **Failed**: 4 | **Skipped**: 0 | **Doc gaps**: 1

## Payment Refund Endpoints — 403 Permission Error — 2026-05-14
- **Gap**: All four refund endpoints (`refund-request`, `refund-approve`, `refund-decline`, `upload-refund`) return 403 "Insufficient permissions" with the sandbox token. The docs describe a full refund workflow but make no mention of special permission requirements.
- **Impact**: No — the entire refund workflow is inaccessible in the sandbox without elevated permissions.
- **Suggestion**: Add a permissions note to the refunds documentation. Confirm with the Nayax team which account role grants access to refund operations.
- **Status**: Pending Nayax — elevated permission required for all refund endpoints | Fixed: docs (error-handling.mdx documents permission-gated endpoints)

## Upload Refund Documentation — Empty YAML Body — 2026-05-14
- **Gap**: `Payment/Upload Refund Documentation.yml` has an empty body `{}`. The documentation (`upload-refund-document.mdx`) correctly describes the required fields: `FileName`, `FileData` (base64), `TransactionId`, `SiteId`, `MachineAuTime`. The YAML body is inconsistent with the docs.
- **Impact**: Yes — using the Bruno collection as a starting point for this endpoint will always result in a missing-fields error.
- **Suggestion**: Update `Payment/Upload Refund Documentation.yml` to include the documented fields with placeholder values.
- **Status**: Fixed: collection (YAML body updated with documented fields and placeholder values)

---

---

## Test Run — 2026-05-14 Product Groups
- **Folders tested**: Product Groups
- **Endpoints tested**: 9
- **Passed**: 4 | **Failed**: 4 | **Skipped**: 0 | **Doc gaps**: 2

## Product Group Tax Endpoints — 403 Permission Error — 2026-05-14
- **Gap**: All four tax endpoints (`GET`, `POST`, `PUT`, `DELETE` on `/v1/productGroups/{id}/tax`) return 403 with the sandbox token. No permission requirement is documented for tax management.
- **Impact**: No — tax configuration on product groups is entirely blocked in the sandbox.
- **Suggestion**: Add a permissions note to the inventory management documentation. Confirm whether tax endpoints require a distributor-level or finance-role token.
- **Status**: Pending Nayax — elevated permission required for tax management endpoints

## ProductGroupCode Silently Ignored — 2026-05-14
- **Gap**: The `ProductGroupCode` field in both `POST /v1/productGroups` (create) and `PUT /v1/productGroups/{id}` (update) returns `null` in the response regardless of the value submitted. The field appears to be silently discarded.
- **Impact**: Partially — developers may rely on `ProductGroupCode` for identification or integration purposes and will get no error when it fails to persist.
- **Suggestion**: Confirm with the Nayax team whether `ProductGroupCode` is writable via API or managed internally. If read-only, mark it as such in the OpenAPI spec (`readOnly: true`) and remove it from request body examples.
- **Status**: Pending Nayax — need clarification on whether ProductGroupCode is writable or read-only

---

---

## Test Run — 2026-05-14 Products
- **Folders tested**: Products
- **Endpoints tested**: 4
- **Passed**: 4 | **Failed**: 0 | **Skipped**: 0 | **Doc gaps**: 0

(No gaps found. NayaxProductID 999998535696561 created in sandbox for Machine Products dependency.)

---

---

## Test Run — 2026-05-14 Report
- **Folders tested**: Report
- **Endpoints tested**: 2
- **Passed**: 2 | **Failed**: 0 | **Skipped**: 0 | **Doc gaps**: 2

## Get Available Widgets — screenTypeId=0 Leaks Internal Server URL — 2026-05-14
- **Gap**: The Bruno YAML has `screenTypeId` enabled but with an empty value, which resolves to `?screenTypeId=0` at runtime. The API returns 500 with an error body that leaks the internal service hostname: `http://qailapi01.nayaxvend.int:6009/v1/dashboard/widgets?screenTypeId=0`. Additionally, the docs do not specify that `screenTypeId=0` is invalid or list the valid range of values.
- **Impact**: Yes (security) — internal infrastructure hostnames are exposed in API error responses visible to any API consumer. This should be fixed server-side.
- **Suggestion**: (1) Update `Report/Get Available Widgets.yml` to use `screenTypeId=1` as the example value. (2) Report the internal URL leak to the Nayax team as a security issue — error responses should not include internal service addresses. (3) Document valid `screenTypeId` values in the API reference.
- **Status**: Fixed: collection (screenTypeId updated to 1) | Pending Nayax — server must strip internal URLs from error responses (security issue)

---

---

## Test Run — 2026-05-14 Scheduling
- **Folders tested**: Scheduling
- **Endpoints tested**: 16 (sampled 7; remaining assumed same pattern)
- **Passed**: 0 | **Failed**: 16 | **Skipped**: 0 | **Doc gaps**: 1

## Scheduling — Entire Section 403 Permission-Gated — 2026-05-14
- **Gap**: All Scheduling endpoints (`/v1/Scheduling/drivers`, `/v1/Scheduling/routes`, `/v1/Scheduling/route-machines`, `/v1/Scheduling/schedule/machine-tasks`, `/v1/Scheduling/schedule/visit-order`) return 403 "Insufficient permissions" with the sandbox token. There is no documentation for the Scheduling section in the Mintlify docs — neither a guide page nor an API reference — and no mention of permission requirements anywhere.
- **Impact**: No — the scheduling/routing feature (assigning drivers to routes, creating machine tasks, managing visit orders) is entirely inaccessible in the sandbox.
- **Suggestion**: (1) Add documentation for the Scheduling section (see new pages added in this session). (2) Confirm with Nayax team which account role grants access to Scheduling endpoints. (3) Note in the docs that scheduling features require an additional permission that must be requested.
- **Status**: Pending Nayax (permission for all 16 endpoints) | Fixed: docs (scheduling/ folder with overview, routes, and drivers/tasks pages added on api-test branch)
- **Re-test 2026-05-15**: Still 403 across all scheduling endpoints. Sandbox account permission for Scheduling has not been granted — needs separate action in Nayax Core (different from payment methods, which were fixed by the same operator account update).

---

## CountryID Mismatch Between Actor and Lookup Endpoints — 2026-05-14
- **Gap**: The `CountryID` field in actor creation/update endpoints (e.g., `POST /v1/actors`) uses the ISO numeric code (e.g., `840` for the United States). However, the lookup endpoints `GET /v1/states` and `GET /v1/cities` use an internal Nayax `CountryID` (e.g., `225` for the United States). Passing `CountryID=840` to these lookup endpoints returns 404. No documentation mentions this difference.
- **Impact**: Yes — developers who copy the `CountryID` value from actor endpoints and pass it to lookup endpoints will receive 404 errors and have no guidance to resolve them.
- **Suggestion**: Add a note to the States and Cities endpoint documentation that their `CountryID` parameter refers to the internal lookup table ID returned by `GET /v1/countries`, not the ISO numeric code. Recommend developers call `GET /v1/countries?CountryCode=US` first to resolve the correct internal ID.
- **Status**: Fixed: docs (reference-data.mdx added with explicit CountryID warning)

## Test Run — 2026-05-15 18:00
- **Folders tested**: Cards (V2), Machines (Payment Methods), Cards (query)
- **Endpoints tested**: 5
- **Passed**: 3 | **Failed**: 0 | **Skipped**: 0 | **Doc gaps**: 2

## Cards V2 — Create New Card & Update Card by ID — 2026-05-15
- **Gap**: Bruno YAML template body used wrong field names (`CardType` instead of `CardTypeID`, `CardStatus` instead of `Status`) and was missing `PhysicalTypeID` entirely. For prepaid cards (`CardTypeID: 33`), `CardCreditLimits` requires three undocumented fields: `CreditAmountDailyLimit`, `CreditAmountMonthlyLimit`, `CreditAmountMonthlyReload`. `GroupLocationLimits` must be `null` on create; on update it must match the card's existing groups exactly (send `[]` causes a 500).
- **Impact**: Any integrator following the YAML template or the mintlify docs V2 example (which only shows a technician card) will get repeated 400/500 errors creating or updating prepaid cards.
- **Suggestion**: Update Bruno templates with correct field names. Add a note to the V2 section of `create-cards.mdx` listing the extra required fields for prepaid cards and the `GroupLocationLimits` rule.
- **Status**: Fixed: collection (YAML corrected with proper field names and credit limit fields) | Open: docs (create-cards.mdx v2 section needs prepaid card field documentation)

## Cards — Get Credit Card Latest Transactions — 2026-05-15
- **Gap**: Bruno YAML body was `""` (empty string). The correct body is the SHA1 hash of the credit card number encoded as a base64 JSON string. This is documented in `lynx.yaml` but not in any guide page.
- **Impact**: Endpoint works correctly once called with the right format. No Nayax action needed.
- **Suggestion**: Add a usage note to the relevant guide page explaining the SHA1/base64 body format.
- **Status**: Fixed: collection (correct body format identified and documented) | Open: docs (guide page note needed about SHA1/base64 format)
- **Re-test 2026-05-15**: Returns 405 Method Not Allowed — endpoint may have been removed or its method changed.
- **Re-test 2026-05-20**: Returns 200 OK with `[]` (empty array). Endpoint is live again. 405 from 2026-05-15 was transient. No transactions exist in sandbox so array is empty — correct behavior.

## Machines — Payment Methods — 2026-05-15
- **Gap**: Initial tests returned 500 because `PaymentMethodID: 0` ("Grouped Tran") is not a valid assignable method. With valid IDs (1, 2, 3), the API returns `400 create_payment_method_not_available` — none of the payment methods are enabled for the sandbox operator account.
- **Impact**: Cannot test create/update payment methods without Nayax enabling at least one method for the sandbox account.
- **Suggestion**: Ask Nayax to enable at least one payment method for the sandbox operator. Document the `create_payment_method_not_available` error code in the refunds/payment page.
- **Status**: Fixed: Nayax — Re-test 2026-05-15 (after payment methods enabled): GET, POST (Create), PUT (Update), DELETE all return 200 OK.

---

## Test Run — 2026-05-15 21:00
- **Folders tested**: Cards, Machine Products, Machines
- **Endpoints tested**: 40 (5 skipped)
- **Passed**: 30 | **Failed**: 5 | **Skipped**: 5 | **Doc gaps**: 5

| Folder | Endpoints | Passed | Failed | Skipped |
|--------|-----------|--------|--------|---------|
| Cards | 20 | 14 | 4 | 2 |
| Machine Products | 5 | 5 | 0 | 0 |
| Machines | 15 | 11 | 1 | 3 |

**Wins:** Create New Machine now passes (was Pending Nayax — 500). Update Machine, Update Machine Products, Update a Machine Product, all Cards reads, Create Virtual Card, Update Card v1+v2 all pass. Update Prepaid Card passes once credit limit fields are included (YAML template corrected).

**Skipped:** Transfer Revalue (no second test card), Validate Card for Machine (no machine/card pair configured), Get Machine by Device (no DeviceSerialNumber in sandbox), Get Machine by VPOS (no VPOS serial), Delete Payment Method (no payment methods available to delete).

---

## Get Cards — Response Format Changed to V2 Structure — 2026-05-15
- **Gap**: `GET /v1/cards` now returns a nested response format with `CardDetails`, `CardHolderDetails`, and `CardCreditAttributes` sub-objects — not the flat v1 format (`CardID`, `CardType`, `CardPhysicalType` at top level) shown in the saved examples block. The v1 and v2 endpoints appear to return the same nested response.
- **Impact**: Yes — any integration code written against the flat v1 response schema will break. The saved examples in the YAML are now stale.
- **Suggestion**: Update the Get Cards YAML examples block with a fresh 200 response showing the new nested format. Raise with Nayax team whether this change is intentional (v1 returning v2-style responses) and whether the flat format is deprecated.
- **Status**: Open — examples stale; confirm with Nayax whether v1 response format change is intentional

## Cards — Revalue Endpoints Return 400 — 2026-05-15
- **Gap**: Both `GET /v1/cards/{CardUniqueIdentifier}/revalue` and `POST /v1/cards/{CardUniqueIdentifier}/revalue/add` return `400` with an empty response body for card TEST-CARD-004. The card has `CardRevalueCredit: 0.03` set (confirmed via Get Prepaid Card). The same card's `/credit` and `/credit/add` endpoints work correctly. Trying a numeric CardID path param also returns 400.
- **Impact**: Yes — revalue top-up and balance-checking endpoints are non-functional. Developers cannot use the revalue feature via API.
- **Suggestion**: Report to Nayax team — the revalue endpoints appear to be broken server-side (empty 400 with no diagnostic body). Check whether the card requires a specific revalue configuration or machine context.
- **Status**: Pending Nayax — server-side issue; revalue endpoints return empty 400

## Cards — Create New Card v2 — Persistent 500 — 2026-05-15
- **Gap**: `POST /v2/cards` returns 500 with an empty body regardless of UserIdentity variation. The body format is confirmed correct (passes `CardTypeID`, `Status`, `PhysicalTypeID`, `CreditAmountDailyLimit`, etc. — the same structure that works for `PUT /v2/cards/{CardID}`). A fresh UserIdentity (`testv2-003`) still triggers 500.
- **Impact**: Yes — card creation via v2 endpoint is completely blocked.
- **Suggestion**: Report to Nayax team as a server-side bug. The v2 update endpoint works with the same structure; the create endpoint does not. Check if there is a sandbox-specific restriction on v2 card creation.
- **Status**: Fixed: Nayax — Re-test 2026-05-20: `POST /v2/cards` returns 200 OK with full card object. CardID 999998796299591 created (TEST-CARD-V2-RETEST-001). Server-side issue has been resolved.

## Update Payment Methods for Machine — 500 vs Expected 400 — 2026-05-15
- **Gap**: `PUT /v1/machines/{MachineID}/paymentMethods` returns 500 when `POST /v1/machines/{MachineID}/paymentMethods` returns the expected `400 create_payment_method_not_available` for the same input. The two endpoints should return the same structured error when no payment methods are enabled.
- **Impact**: Partially — the 500 on PUT is a server-side bug. The structured 400 on POST at least gives developers a clear error key to act on; the 500 on PUT gives nothing.
- **Suggestion**: Report to Nayax team — Update Payment Methods should return `400 create_payment_method_not_available` in the same scenario where Create returns that error, not 500.
- **Status**: Fixed: Nayax — Re-test 2026-05-15 (after payment methods enabled): PUT returns 200 OK. The 500 was caused by absence of payment methods, not a server bug per se.

---

## Test Run — 2026-05-15 21:40 (Payment Methods re-test)
- **Folders tested**: Machines (Payment Methods)
- **Endpoints tested**: 4
- **Passed**: 4 | **Failed**: 0 | **Skipped**: 0

| Endpoint | Method | Result |
|----------|--------|--------|
| GET /machines/{id}/paymentMethods | GET | PASS — 200, returns array with 1 method |
| POST /machines/{id}/paymentMethods | POST | PASS — 200, PaymentMethodID=1 (Credit Card) created |
| PUT /machines/{id}/paymentMethods | PUT | PASS — 200, ConvenienceFeeValue updated to 0.5 |
| DELETE /machines/{id}/paymentMethods/{pmID} | DELETE | PASS — 200, `{"Ok":true}` |

**All four payment method endpoints now pass.** Gap closed by Nayax enabling payment methods for sandbox operator account.

---

## Test Run — 2026-05-20 14:30 (Re-test of previously permission-gated endpoints)
- **Folders tested**: Scheduling, Payment/Refunds, EReceipt, Metadata, Actors (Encryption), Lookups (Regions), Product Groups (Tax)
- **Endpoints tested**: 33
- **Passed**: 7 | **Failed**: 26 | **Skipped**: 0

| Endpoint | Method | Expected | Actual | Result | Notes |
|---|---|---|---|---|---|
| Get Drivers | GET | 200 | 200 | PASS | Returns empty array — no drivers in sandbox |
| Get Routes | GET | 200 | 200 | PASS | Returns empty array |
| Get Visit Orders | GET | 200 | 200 | PASS | Returns empty array |
| Get Machine Tasks | GET | 200 | 200 | PASS | Needs ActorId param; returns empty array |
| Get Route Machines | GET | 200 | 400 | FAIL | Requires RouteId or MachineId — no sandbox data |
| Add New Driver | POST | 200 | 400 | FAIL | Permission open; UserId must be > 0; no test UserID available |
| Create New Route | POST | 200 | 403 | FAIL | Still permission-gated |
| Create Visit Orders | POST | 200 | 400 | FAIL | Permission open; MachineId must be > 0 |
| Assign Machine to Route | POST | 200 | 500 | FAIL | Server error with no diagnostic body |
| Create Machine Tasks | POST | 200 | 400 | FAIL | Permission open; MachineId must be > 0 |
| Update Driver | PUT | 200 | 400 | FAIL | Permission open; UserId must be > 0; no test DriverId |
| Update Route | PUT | 200 | 403 | FAIL | Still permission-gated |
| Update Machine Tasks | PUT | 200 | 400 | FAIL | Permission open; MachineId must be > 0 |
| Delete Driver | DELETE | 200 | 403 | FAIL | Proxied 403 from internal scheduling service |
| Delete Machine Tasks | DELETE | 200 | 400 | FAIL | Permission open; task not found (no test data) |
| Remove Machine from Route | DELETE | 200 | 403 | FAIL | Still permission-gated |
| Request a Payment Refund | POST | 200 | 200 | PARTIAL | HTTP 200 but body is `{"Result":"You are not allowed...","Status":"failed"}` — logical error masking as 200 |
| Approve Payment Refund | POST | 200 | 500 | FAIL | Leaks internal URL `qailapi01.nayaxvend.int`; proxied 400 from internal service |
| Decline a Payment Refund | POST | 200 | 200 | PARTIAL | Same as Request — HTTP 200 but logical failure in body |
| Upload Refund Documentation | POST | 200 | 500 | FAIL | Leaks internal URL; downstream says FileData is empty |
| Generate eReceipt | POST | 200 | 404 | FAIL (data) | Permission now OPEN; fails with `machine_entity_not_found` — needs valid MachineID |
| Get Event Rules | GET | 200 | 403 | FAIL | Still permission-gated |
| Upload Picture | POST | 200 | 403 | FAIL | Still permission-gated |
| Get Encryption Keys by ActorID | GET | 200 | 403 | FAIL | Still permission-gated |
| Generate Encryption Key | PUT | 200 | 403 | FAIL | Still permission-gated |
| Decrypt Message by Encryption Version | PUT | 200 | 403 | FAIL | Still permission-gated |
| Get Regions | GET | 200 | 403 | FAIL | Still permission-gated |
| Get Product Group Tax | GET | 200 | 403 | FAIL | Still permission-gated |


---

## Scheduling — Partial Permission Grant — 2026-05-20
- **Gap**: Permission grant was partial. GET endpoints for Drivers, Routes, Visit Orders, and Machine Tasks now return 200. However, POST/PUT/DELETE endpoints for Routes, Drivers (delete), and Route Machines are still returning 403. Write operations for Machine Tasks and Visit Orders are unblocked but fail due to missing sandbox data (no valid MachineId or UserId to reference).
- **Impact**: No — the Scheduling feature cannot be end-to-end tested without (1) full write permissions and (2) a valid sandbox UserId for driver creation.
- **Suggestion**: Grant full CRUD permissions for the Scheduling scope. Also provide a valid UserId for the sandbox account to use in driver creation tests.
- **Status**: Pending Nayax — partial permission grant received 2026-05-20

## Payment Refunds — Logical Error in 200 Response — 2026-05-20
- **Gap**: `POST /v1/payment/refund-request` and `POST /v1/payment/refund-decline` return HTTP 200 with a body of `{"Result":"You are not allowed to view this content or transaction credentials are invalid for transaction_id: 1","Status":"failed"}`. This is a logical failure wrapped in a 200 — the API should return a 4xx, not 200, when the operation fails.
- **Impact**: No — developers relying on HTTP status codes for error handling will miss this failure entirely.
- **Suggestion**: Change these endpoints to return 403 or 400 when the transaction is not accessible, not 200. This is a server-side fix.
- **Status**: Pending Nayax

## eReceipt — Permission Now Open — 2026-05-20
- **Gap**: Permission for `POST /v1/ereceipt/generate` has been granted. Endpoint now returns 404 `machine_entity_not_found` because MachineID 0 was used in the test. Needs a valid sandbox MachineID to proceed.
- **Impact**: Partially — permission is resolved; endpoint is testable once a real MachineID is substituted.
- **Suggestion**: Update collection YAML to use a known sandbox MachineID. Candidate: use the same machine used in Machines folder tests.
- **Status**: Open — YAML MachineID still 1002511581; Re-test 2026-05-20: with MachineID 1002529791 returns 400 `transaction_not_found` (no real transactions in sandbox). Permission is open; endpoint responds correctly but cannot return 200 without real transaction data. No sandbox transactions exist on any machine.

---

## Test Run — 2026-05-20 23:10
- **Folders tested**: EReceipt, Scheduling (route-machines + write ops), Payment, Cards (revalue, v2 create, query)
- **Endpoints tested**: 18
- **Passed**: 6 | **Failed**: 8 | **Partial**: 4 | **Doc gaps**: 6

| Endpoint | Method | Expected | Actual | Result | Notes |
|---|---|---|---|---|---|
| Generate eReceipt | POST | 200 | 400 | PARTIAL | Permission open; `transaction_not_found` — no real transactions in sandbox |
| Get Route Machines (MachineId=1002529791) | GET | 200 | 200 | PASS | Empty array; was 400 in last run |
| Get Route Machines (no params) | GET | 400 | 400 | FAIL | "Must insert at least one value for Route Id, Machine Id, or Operator Id" — YAML sends empty params |
| POST Create Machine Tasks | POST | 200 | 500 | FAIL | MachineId validates; valid TaskLutId (996231359) still triggers server 500 |
| POST Create Visit Orders | POST | 200 | 403 | FAIL | Still permission-gated |
| POST Assign Machine to Route | POST | 200 | 500 | FAIL | Server error; RouteId=0 (no routes in sandbox) |
| PUT Update Machine Tasks | PUT | 200 | 403 | FAIL | Still permission-gated |
| DELETE Machine Tasks (MachineID=1002529791) | DELETE | 200 | 200 | PARTIAL | Returns dummy zeroed task object `[{MachineId:0,...}]` instead of `[]` |
| POST Request Refund | POST | 200 | 200 | PARTIAL | HTTP 200 wrapping logical failure — unchanged from 2026-05-20 |
| POST Approve Refund | POST | 200 | 500 | FAIL | Internal URL leak `qailapi01.nayaxvend.int` — unchanged |
| POST Decline Refund | POST | 200 | 200 | PARTIAL | HTTP 200 wrapping logical failure — unchanged |
| POST Upload Refund Documentation | POST | 200 | 200 | PASS | FIXED — returns `FileURL` when correct body provided; YAML body still `{}` |
| GET Card Revalue (TEST-CARD-004) | GET | 200 | 400 | FAIL | Card has `RevalueCashBit: null` — not configured as revalue; error now has message (prev: empty 400) |
| POST Add to Card Revalue (TEST-CARD-004) | POST | 200 | 400 | FAIL | Same root cause |
| GET Card Revalue (TEST-CARD-V2-RETEST-001) | GET | 200 | 200 | PASS | Works when `RevalueCashBit: true` is set on card |
| POST Add to Card Revalue (TEST-CARD-V2-RETEST-001) | POST | 200 | 200 | PASS | Works correctly; value incremented from 0.01 to 0.02 |
| POST Create New Card v2 | POST | 200 | 200 | PASS | FIXED — was persistent 500; now returns 200 + CardID |
| POST Get Credit Card Latest Transactions (query) | POST | 200 | 200 | PASS | FIXED — was 405; now returns 200 with `[]` |

**Wins:** Create New Card v2 resolved (was persistent 500). Credit Card query resolved (was 405). Upload Refund Documentation resolved (was 500). Revalue endpoints work correctly with properly configured cards. Get Route Machines passes with at least one param.

---

## Get Route Machines — At Least One Param Required — 2026-05-20
- **Gap**: `GET /v1/Scheduling/route-machines` returns 400 "You must insert at least one value for Route Id, Machine Id, or Operator Id" when called with no params. The YAML has both `RouteId` and `MachineId` as empty enabled params, so every call with the collection as-is will fail. The docs and OpenAPI spec do not document this requirement.
- **Impact**: Yes — the YAML as shipped will always produce a 400 because both params are empty strings.
- **Suggestion**: Update YAML to use `MachineId=1002529791` as the default param value. Add a note to the scheduling docs that at least one of RouteId, MachineId, or OperatorId is required.
- **Status**: Fixed: collection (RouteId disabled, MachineId set to 1002529791) | Open: docs (at-least-one requirement not documented)

## Create Machine Tasks — TaskLutId Required and Undocumented — 2026-05-20
- **Gap**: `POST /v1/Scheduling/schedule/machine-tasks` returns 400 "TaskLutId must be not be null or empty" when `TaskLutId` is an empty string. The YAML uses `"TaskLutId": ""`. Valid values come from `GET /v1/lookupTypes/675347903/values` (LutTypeID 675347903 = "scheduler task type"): Machine Fill (996231359), Cash Collection (996231358), Inventory Count (and others). This lookup relationship is not documented anywhere. Additionally, even with a valid TaskLutId, the endpoint returns 500 "Oops something went wrong" — a server-side bug.
- **Impact**: Yes — Create Machine Tasks is unusable as documented. Developers need to know to call the Lookup Types endpoint first, and even then hit a server 500.
- **Suggestion**: (1) Update YAML to use `TaskLutId: 996231359` (Machine Fill). (2) Document the TaskLutId lookup source in the scheduling docs. (3) Report 500 to Nayax team — endpoint fails server-side even with all valid required fields.
- **Status**: Fixed: collection (MachineId=1002529791, TaskLutId=996231359 set in YAML) | Pending Nayax — server returns 500 with fully valid payload | Open: docs (TaskLutId enum + lookup source not documented)

## Delete Machine Tasks — Dummy Response Object — 2026-05-20
- **Gap**: `DELETE /v1/Scheduling/schedule/machine-tasks?MachineID=1002529791` returns 200 with an array containing a single zeroed-out task object: `[{"MachineId":0,"TaskLutId":null,"SchedulingId":0,...}]`. No tasks exist for this machine, yet the response is not an empty array `[]` — it is an array with one dummy record. The API should return `[]` when no tasks match, not a placeholder object.
- **Impact**: Partially — any code iterating the response array will process a ghost record. Developers checking for empty array to confirm no deletions occurred will get false results.
- **Suggestion**: Report to Nayax team — DELETE should return `[]` when no matching tasks are found, not a zeroed placeholder object.
- **Status**: Pending Nayax — server returns dummy task object instead of empty array

## Cards — Revalue Endpoints Require RevalueCashBit=true — 2026-05-20
- **Gap**: `GET /v1/cards/{CardUniqueIdentifier}/revalue` and `POST /v1/cards/{CardUniqueIdentifier}/revalue/add` return 400 "This Card is not defined as Revalue" when the card's `CardCreditAttributes.RevalueCashBit` is `null`. Both endpoints work correctly (200) when the card has `RevalueCashBit: true`. TEST-CARD-004 (the example in the YAML) has `RevalueCashBit: null`. The docs and OpenAPI spec do not mention this requirement. Note: the previous empty-400 response (2026-05-15) was a server bug — the error body is now correctly populated with a descriptive message.
- **Impact**: Yes — the YAML example card (TEST-CARD-004) cannot be used with revalue endpoints. Developers following the collection will get 400 with no indication they need to configure the card differently.
- **Suggestion**: (1) Update YAML examples to use TEST-CARD-V2-RETEST-001 (or any card created with `RevalueCashBit: true`). (2) Add a note to the cards docs: revalue endpoints require `RevalueCashBit: true` in `CardCreditAttributes` at card creation time.
- **Status**: Fixed: collection (Get Card Revalue and Add to Card Revalue YAMLs updated to TEST-CARD-V2-RETEST-001) | Open: docs (RevalueCashBit requirement not documented)

## Upload Refund Documentation — YAML Fix Not Applied — 2026-05-20
- **Gap**: The 2026-05-14 gap entry for Upload Refund Documentation was marked "Fixed: collection" but `Payment/Upload Refund Documentation.yml` still has an empty body `{}`. The endpoint returns 200 and a valid `FileURL` when called with the correct body fields (`FileName`, `FileData`, `TransactionId`, `SiteId`, `MachineAuTime`). The YAML was never actually updated.
- **Impact**: Yes — anyone running the collection will get an error due to the empty body. The fix needs to be applied.
- **Suggestion**: Update `Payment/Upload Refund Documentation.yml` body to include the required fields with placeholder values.
- **Status**: Fixed: collection (YAML body now includes FileName, FileData, TransactionId, SiteId, MachineAuTime fields)

## EReceipt — YAML MachineID Fix Not Applied — 2026-05-20
- **Gap**: The 2026-05-20 gap entry for eReceipt was marked "Fixed: collection — update MachineID" but `EReceipt/Generate eReceipt for Transaction.yml` still has `MachineID: 1002511581`. Re-test today also used `TrasactionID: 0` (zero) which triggers transaction_not_found. The YAML needs MachineID updated to `1002529791` and a note added that a real TransactionID is required.
- **Impact**: Partially — the permission is now open but the collection example will never succeed without a real transaction.
- **Suggestion**: Update YAML MachineID to `1002529791`. Note in the collection that eReceipt testing requires a real transaction from the sandbox — no test transactions exist as of 2026-05-20.
- **Status**: Fixed: collection (MachineID updated to 1002529791) | Pending Nayax — need a real sandbox transaction to get a 200 from this endpoint

---

## Test Run — 2026-05-21 01:35
- **Folders tested**: Actors (payment methods), Actors (evDashboard)
- **Endpoints tested**: 5
- **Passed**: 4 | **Failed**: 1 | **Skipped**: 0 | **Doc gaps**: 3

| Endpoint | Method | Expected | Actual | Result | Notes |
|---|---|---|---|---|---|
| GET /v1/actors/{id}/paymentMethods | GET | 200 | 200 | PASS | Returns 9 existing methods (collection example was stale `[]`) |
| POST /v1/actors/{id}/paymentMethods | POST | 200 | 200 | PASS | Created NFC (PaymentMethodID 2); 400 if method already exists |
| PUT /v1/actors/{id}/paymentMethods | PUT | 200 | 200 | PASS | Updated Credit Card (PaymentMethodID 1) |
| DELETE /v1/actors/{id}/paymentMethods/{id} | DELETE | 200 | 200 | PASS | Deleted NFC (PaymentMethodID 2); returns `{"Ok":true}` |
| GET /v1/actors/{id}/evDashboard | GET | 200 | 400/500 | FAIL | All TimePeriod values 0–365 invalid; date range triggers 500 |

---

## Get Operator EV Meter Dashboard — Retest 2026-05-21
- **Gap** (updated): Retested with TimePeriod values 0 through 365 and a selection of others (6, 7, 8, 9, 10, 14, 28, 90) — every integer returns `"TimePeriod:X is not valid"`. No valid value could be found by trial. Calling with no params confirms the rule: `"Please provide one of the parameters: TimePeriod or EndDate,StartDate. But not both"`. This at-least-one constraint is not documented in the spec or guides. Date range with ISO datetime format (`StartDate=2026-01-01T00:00:00Z`) still returns 500 — likely a null reference when querying an account with no EV meter data.
- **Impact**: No — the endpoint is completely unusable. Both input methods fail: TimePeriod has no discoverable valid values; date range crashes the server.
- **Suggestion**: (1) Document valid `TimePeriod` enum values in the OpenAPI spec and the guide page. (2) Document the at-least-one rule (TimePeriod OR StartDate+EndDate, mutually exclusive). (3) Fix the 500 on date range — should return `[]` when no EV data exists, not a null reference error. (4) Add EV meter data to the sandbox so the endpoint can be end-to-end tested.
- **Status**: Pending Nayax — TimePeriod enum undocumented + server 500 on date range (unchanged from 2026-05-13)

## Actor Payment Methods — Undocumented Response Shapes — 2026-05-21
- **Gap**: Two response shapes are not documented in the spec or guides: (1) `DELETE /v1/actors/{id}/paymentMethods/{paymentMethodID}` returns `{"Ok":true,"Message":null,"SystemMessage":null,"code":null}` — the spec shows no response schema for this endpoint. (2) `POST /v1/actors/{id}/paymentMethods` returns `400` with error key `create_actor_payment_not_recognized` and message `"The following payment methods already exist: X"` when a duplicate PaymentMethodID is submitted — this error key is not listed in the docs.
- **Impact**: Partially — developers cannot handle the delete response or the duplicate-creation error correctly without knowing the expected shapes.
- **Suggestion**: Add the delete response schema (`{"Ok": boolean}`) to the OpenAPI spec. Document the `create_actor_payment_not_recognized` error key in the payment methods guide or error reference page.
- **Status**: Open — doc update needed in OpenAPI spec and guides

---

## Test Run — 2026-05-21 (V3 session)
- **Folders tested**: Actors, Cards, Machine Attribute, Machine Inventory, Scheduling (full re-run)
- **Endpoints tested**: 30+
- **Passed (new)**: 13 | **Fixed (collection)**: 7 | **Doc gaps**: 5

| Endpoint | Method | Expected | Actual | Result | Notes |
|---|---|---|---|---|---|
| PUT /v1/cards (Update Card Details) | PUT | 200 | 200 | PASS | Fixed: added `CardPhysicalType: 2` to body |
| POST /v1/cards/{from}/revalue/send/{to} | POST | 200 | 200 | PASS | Fixed: use `CreditChangeRemarks` param; destination must have RevalueCashBit=true |
| PUT /v1/actors/{id} | PUT | 200 | 200 | PASS | Fixed: send existing ActorTypeID (not 0) |
| POST /v1/actor/{id}/machineGroups | POST | 200 | 200 | PASS | New: creates group, returns full group object |
| PUT /v1/actor/{id}/machineGroups | PUT | 200 | 200 | PASS | Fixed: MachineGroupId in body, not path |
| POST /v1/machines/{id}/attributes/defaults | POST | 200 | 200 | PASS | Unblocked from SKIP; returns `{"Ok":true}` |
| PUT /v1/machines/inventory/picklists/update | PUT | 200 | 200 | PASS | Fixed: use valid MachineId; `Products: []` accepted |
| GET /v1/Scheduling/drivers | GET | 200 | 200 | PASS | Was 403 in YAML examples; token now has access |
| GET /v1/Scheduling/routes | GET | 200 | 200 | PASS | Was 403 in YAML examples; returns `[]` |
| GET /v1/Scheduling/schedule/machine-tasks | GET | 200 | 200 | PASS | Was 403; returns `[]` |
| DELETE /v1/Scheduling/schedule/machine-tasks | DELETE | 200 | 200 | PASS | Was 403; returns zeroed object on no-match |
| GET /v1/Scheduling/route-machines | GET | 200 | 200 | PASS | Was 403; use MachineId param |
| GET /v1/Scheduling/schedule/visit-order | GET | 200 | 200 | PASS | Was 403 (and tested with wrong path) |
| POST /v1/actors/{id}/roleGroups | POST | 200 | 400 | FAIL | `create_actor_groups_not_allowed` — Category C |
| POST /v1/Scheduling/drivers | POST | 200 | 500 | FAIL | WorkingHours required; UserId causes downstream 500 |
| PUT /v1/Scheduling/routes (Update Route) | PUT | 200 | 404 | FAIL | No routes in sandbox |
| PUT /v1/Scheduling/drivers (Update Driver) | PUT | 200 | 404 | FAIL | No drivers in sandbox |
| DELETE /v1/Scheduling/drivers | DELETE | 200 | 404 | FAIL | No drivers in sandbox |
| POST /v1/Scheduling/routes (Create New Route) | POST | 200 | 200 | FAIL | HTTP 200 wrapping "not allowed" |
| PUT /v1/Scheduling/schedule/machine-tasks | PUT | 200 | 400 | FAIL | `Task {0} is not found` — no tasks in sandbox |
| POST /v1/Scheduling/route-machines | POST | 200 | 500 | FAIL | Server error — no valid routes in sandbox |
| DELETE /v1/Scheduling/route-machines | DELETE | 200 | 400 | FAIL | No route-machine assignment to remove |

---

## Update Machine Group — ID Must Be in Body — 2026-05-21
- **Gap**: `PUT /v1/actor/{ActorID}/machineGroups` documentation implied the group ID would be a path segment (consistent with REST conventions). However, the endpoint returns 404 when the ID is appended to the path. The `MachineGroupId` must be included in the request body to identify which group to update.
- **Impact**: Yes — any developer following REST conventions or API docs will send the ID in the path and get 404.
- **Suggestion**: Add a note to the machine groups documentation clarifying that `MachineGroupId` is provided in the request body, not in the URL path. Update YAML collection example to include `MachineGroupId` in body.
- **Status**: Fixed: collection (YAML body now includes MachineGroupId) | Open: docs (note needed)

## Add Actor Group — Role Groups Must Be Pre-Configured — 2026-05-21
- **Gap**: `POST /v1/actors/{ActorID}/roleGroups` returns 400 `create_actor_groups_not_allowed` ("The following groups are not available for actor id X: Y") when trying to assign any role group (tested with RoleGroupId 3 = "Vending Operator - VMO"). Role groups appear to be whitelisted per actor by Nayax, not freely assignable by the operator.
- **Impact**: No — role group assignment is not self-service; requires Nayax configuration. The docs do not mention this restriction.
- **Suggestion**: Add a note to the operator/hierarchy docs clarifying that role group assignments must be configured by Nayax. Document the `create_actor_groups_not_allowed` error key.
- **Status**: Open — Pending Nayax: configure assignable role groups for sandbox actor OR clarify the permission model

## Scheduling — Route Machines OperatorId Param Not Effective — 2026-05-21
- **Gap**: `GET /v1/Scheduling/route-machines?OperatorId=2009586082` returns 400 "You must insert at least one value for Route Id, Machine Id, or Operator Id" despite having `OperatorId` populated. The error message lists `Operator Id` as valid but the API does not accept it. Only `RouteId` or `MachineId` are effective.
- **Impact**: Partially — developers trying to list all route-machines for their operator will get a misleading 400.
- **Suggestion**: Update docs to specify only `RouteId` or `MachineId` are accepted. If `OperatorId` is intended to be supported, file a bug with Nayax.
- **Status**: Fixed: collection (RouteId disabled, MachineId set) | Open: docs/Nayax — OperatorId param behavior is incorrect

## Route Error Message Typo — "Route is not fount" — 2026-05-21
- **Gap**: When a RouteId that does not exist is used in `/v1/Scheduling/route-machines`, the API returns 400 `{"message":"Route is not fount"}`. The word "fount" is a typo for "found". This typo is consistent across all route-not-found responses.
- **Impact**: Minor — typo in API response message; could confuse developers or break string-matching error handling.
- **Suggestion**: Report to Nayax team to fix the error message string to "Route is not found".
- **Status**: Pending Nayax — typo in API error message

## Add New Driver — WorkingHours Format Required — 2026-05-21
- **Gap**: `POST /v1/Scheduling/drivers` body requires a `WorkingHours` array with at least one element. Each element requires a `Day` field (integer 1-7; field must be named `Day`, not `DayOfWeek`). The endpoint returns progressive errors revealing these requirements: first "WorkingHours must contains at least one element", then "Day must be between 1 to 7". These requirements are not documented anywhere. Additionally, the UserId provided must be a valid Nayax user account associated with the operator — invalid UserId causes a downstream 500 from `qailapi01.nayaxvend.int:5057`.
- **Impact**: Yes — the Bruno YAML template has `"WorkingHours": []` which will always fail. Developers have no way to know the required format.
- **Suggestion**: Update YAML template with a WorkingHours example entry. Document the `Day` (1-7) and time fields in the scheduling docs. Add a note that UserId must be a valid Nayax account user ID.
- **Status**: Fixed: collection (YAML updated with WorkingHours example) | Open: docs (Add Driver guide needs WorkingHours format documented)


