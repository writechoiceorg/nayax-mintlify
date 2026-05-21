# Known Behaviors

Confirmed non-obvious API behaviors found during testing. Read this before diagnosing any failure — most of these will look like bugs or config errors on first encounter but are actually expected (or at least consistent) API behavior.

Each entry records: what you'd expect, what actually happens, and the doc implication.

---

## Auth and tokens

| Behavior | Detail |
|----------|--------|
| **401 with body = scope issue** | When a 401 response includes a JSON body, the token was accepted — the account lacks access to that endpoint. Contact Nayax account manager. Retrying does not help. |
| **401 without body = bad token** | A 401 with no body (or followed by 5xx) means the request did not reach the application. Check the `Authorization: Bearer` header. |
| **Token does not expire** | Lynx tokens are long-lived static credentials. A 401 is never caused by expiry. |
| **Sign In returns HTML** | `GET /v1/actors/signIn` returns a web UI page, not a bearer token. It cannot be used for programmatic auth. |
| **Four names, one credential** | "Token", "Bearer Token", "API Token", "User Token" in Nayax docs all refer to the same value from Nayax Core → Account Settings → User Tokens. |

---

## Actors and hierarchy

| Behavior | Detail |
|----------|--------|
| **ActorID and ActorCode are not interchangeable** | ActorID is a large numeric value (`2009586082`). ActorCode is a short identifier (`1222`). Each endpoint declares exactly one of these in its path or params — sending the wrong one returns 404 or wrong data silently. |
| **CountryID has two formats** | Actor endpoints use ISO numeric CountryID (`840` for US). Lookup, card, and most other endpoints use Nayax internal CountryID (`225` for US). Confirmed: `POST /v1/cards` rejects `CountryID: 840` with `country_id_not_valid` — must use `225`. When in doubt, use internal format (225) except for actor-specific endpoints. |
| **Create Actor v2 field name** | The `ActorStatus` field name shown in some docs and collections is wrong. The API requires `StatusID`. Sending `ActorStatus` is silently ignored and the actor is created with a default status. |
| **Billing plan required for Create Actor v2** | `ActorBillingPlanID` must be a valid, configured billing plan ID for the sandbox. No valid value is available in current sandbox — endpoint is Category C blocked. |

---

## Cards

| Behavior | Detail |
|----------|--------|
| **RevalueCashBit must be set at creation** | `CardCreditAttributes.RevalueCashBit: true` must be included when creating a card. It cannot be enabled later. Cards without it return `400 "This Card is not defined as Revalue"` on all revalue endpoint calls. Use `TEST-CARD-V2-RETEST-001` for revalue tests. |
| **GroupLocationLimits: null on create, exact match on update** | Sending `[]` on create causes a 500. On update, the array must exactly match the card's current groups — adding/removing groups via this field is not supported. |
| **Prepaid cards require extra credit limit fields** | When `CardTypeID: 33`, the `CardCreditLimits` object must include `CreditAmountDailyLimit`, `CreditAmountMonthlyLimit`, and `CreditAmountMonthlyReload`. Omitting any returns 400 naming the first missing field. |
| **v1 CardPhysicalType is a number, v2 PhysicalTypeID is a different number** | v1 Create Virtual Card uses `CardPhysicalType: 2` (swipe). v2 Create New Card uses `PhysicalTypeID: 30000528` for the same type. They are different field names with different enum sets. |
| **SHA1/base64 body for card query** | `POST /v1/cards/query` requires the request body to be SHA1-hashed and base64-encoded. Sending plain JSON returns 400. This is completely undocumented. |

---

## Machines

| Behavior | Detail |
|----------|--------|
| **SalesSourceID `1` is invalid** | Machine creation requires `SalesSourceID: 30000512`. Using `1` causes a 500. This valid value is not documented anywhere in the spec. |
| **DeviceID = 0 on all sandbox device records** | Every device record in the sandbox returns `DeviceID: 0`. Whether this is a sandbox-only issue or DeviceSerial is the intended key is unconfirmed — flagged to Nayax. |
| **Create Pick List returns empty 200** | `POST /v1/machines/{id}/pickLists` returns `200 OK` with no response body on success. An empty body is not an error. Confirm the list was created with `GET /v1/machines/{id}/pickList`. |

---

## Scheduling

| Behavior | Detail |
|----------|--------|
| **TaskLutId is a required lookup** | Must be a value from LutTypeID `675347903`. Machine Fill = `996231359`, Cash Collection = `996231358`. Retrieve the full list with `GET /v1/lookupTypes/675347903/values`. |
| **Get Route Machines requires at least one param** | The endpoint returns 400 if no query params are sent. At least one of `RouteId`, `MachineId`, or `OperatorId` is required. Undocumented. |
| **Delete Machine Tasks returns a zeroed object on no-match** | When no tasks match the provided `MachineID`, the response is `[{"MachineId": 0, ...all fields null}]` instead of `[]`. Treat `MachineId === 0` as a no-match result. |
| **Create Machine Tasks 500 is a server bug** | Fails server-side with a fully valid payload (`MachineId=1002529791`, `TaskLutId=996231359`). Category B — no workaround. |

---

## Devices

| Behavior | Detail |
|----------|--------|
| **Move Devices empty array = silent fail** | `PUT /v1/devices/move/{actorId}` returns `200 OK` with `[]` when no devices matching the provided serial numbers were found. A 200 with an empty array is not success — check that the array contains device entries. |

---

## Payment and refunds

| Behavior | Detail |
|----------|--------|
| **Request Refund and Decline Refund return HTTP 200 on logical failure** | Both endpoints return `HTTP 200` with a body containing `{"Status": "failed", "Result": "You are not allowed..."}`. Do not trust the HTTP status code — always check the `Status` field in the body. |
| **Approve Refund 500 leaks internal hostname** | Returns a 500 that exposes `http://qailapi01.nayaxvend.int:5064` in the error body. This is a security issue flagged to Nayax. Category B. |
| **Upload Refund Documentation needs a file reference** | Sending `{}` as the body returns 500. The endpoint requires a `FileURL` or equivalent file reference in the body. |

---

## Product groups

| Behavior | Detail |
|----------|--------|
| **ProductGroupCode is silently ignored on write** | Sending `ProductGroupCode` in POST/PUT requests has no effect — the server does not return an error, but the field is not set. Likely read-only. Pending confirmation from Nayax. |

---

## Metadata and diagnostics

| Behavior | Detail |
|----------|--------|
| **Metadata URL has double version prefix** | The event rules endpoint is at `/v1/metadata/v1/event-rules` — the double `v1` in the path may be intentional or a bug. Unconfirmed. |
| **Get Available Widgets leaks internal hostname** | `screenTypeId=0` causes a 500 that exposes `http://qailapi01.nayaxvend.int:6009`. Use `screenTypeId=1`. Category B. |

---

## eReceipt

| Behavior | Detail |
|----------|--------|
| **Field name typos in spec and API** | `TrasactionID` and `TrasactionSiteID` are the actual field names used by the API (missing 'n' in "Transaction"). The typo appears in the spec and in API responses. Use the misspelled names to match the API — do not correct them in requests. |
