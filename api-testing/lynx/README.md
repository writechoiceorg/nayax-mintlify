# Nayax Lynx API Testing

This is a Bruno collection for testing the Nayax Lynx API. The goal is to validate the API and spot documentation gaps — skills come later.

---

## Products tested

| Product | Status | Collection location |
| --- | --- | --- |
| **Lynx** | Complete (May 2026) — 85/147 pass, 46 fail, 8 skip | `api-testing/lynx/` |
| Cortina | Scaffolded — blocked pending sandbox credentials | `api-testing/cortina/` |
| ecom | Scaffolded — blocked pending JWT RSA token | `api-testing/ecom/` |
| e-receipt | Scaffolded — blocked, no server URL provided | `api-testing/e-receipt/` |
| Spark | Scaffolded — blocked, requires callback URL + security keys | `api-testing/spark/` |

---

## How we test

The goal of each test run is to verify that the Nayax API behaves exactly as the OpenAPI spec and documentation say it should. We are not just checking whether requests succeed — we are checking whether the responses match what is documented.

**The source of truth is `openapi/lynx.yaml`.** Before running any endpoint, we read the spec to confirm the expected status code, required fields, and response shape.

### Each endpoint gets checked for:

- Correct HTTP status code (e.g. 200, 201, 404)
- Response body fields match the spec (names, types, presence of required fields)
- No undocumented fields or error structures appearing in the response
- No server errors (500) on valid inputs

### How we classify failures:

| Category | Meaning | Who fixes it |
| --- | --- | --- |
| **A — Permission-gated (403)** | Sandbox token lacks the role to call this endpoint | Nayax must grant sandbox permissions |
| **B — Server bug (500/400)** | Valid request causes a server crash or undocumented error | Nayax engineering |
| **C — Sandbox config gap** | Endpoint works but required data (e.g. billing plan, payment method) is not set up in the sandbox | Nayax sandbox setup |
| **D — Doc/collection gap** | Request format was wrong because the docs were unclear or wrong — we fix these as we go | WriteChoice (us) |

### What gets recorded:

- **`gap-log.md`** — one entry per finding; includes the endpoint, what we expected, what we got, and the category
- **`api-test-report.md`** — consolidated report with pass/fail totals, full failure breakdown, and a prioritised action list for the Nayax team
- **Bruno example files** — each request that ran successfully has a saved example response in the collection so future runs have a baseline to compare against

---

## Before you can run anything

- [ ] **Get your bearer token** from Nayax Core UI: Account Settings → User Tokens. Paste it into the `NAYAX_TOKEN` environment variable (mark as secret).
- [ ] **Get sandbox credentials** from Moshe or Shaha at Nayax: `NAYAX_USER` and `NAYAX_PASS` (only needed for the Sign In folder tests).
- [ ] `base_url` is already set to `https://qa-lynx.nayax.com` — no change needed.

---

## How to open the collection in Bruno

1. Download Bruno from https://www.usebruno.com/ if you don't have it.
2. Open Bruno → click **Open Collection**.
3. Navigate to `C:\GitHub\nayax-mintlify\nayax-mintlify\api-testing\lynx` and select it.
4. In the top-right **Environments** dropdown, select **Nayax Lynx Sandbox**.
5. Click the environment → fill in `NAYAX_TOKEN` (and optionally `NAYAX_USER` / `NAYAX_PASS`). Mark all as secrets so they are not committed.

---

## How to run a test

1. Set `NAYAX_TOKEN` in the environment — every request uses it automatically via `Authorization: Bearer`.
2. Run requests folder by folder. Each folder has its own `README.md` with the recommended run order.
3. After each request: compare the response to the OpenAPI spec (`openapi/lynx.yaml`). Log any mismatch in `gap-log.md`.

---

## Common flows

Some endpoints depend on each other and must be run in order.

**Cards — create and use a card:**
1. Create Virtual Card → note the `CardUniqueIdentifier` (e.g. `TEST-CARD-001`)
2. Get Cards (search by `CardUniqueIdentifier`)
3. Get Card by Unique Identifier / Get Card by Display Number
4. Add to Card Revalue → check with Get Card Revalue
5. Add Credit to a Card → check with Get Credit from a Card
6. Transfer Revalue Between Cards (requires two existing cards)
7. Update Card Status / Update Card Details / Validate Card for Machine

**Machines — read before writing:**
1. Get All Machine Basic Info (establishes baseline, note a `MachineID`)
2. Get Specific Machine Basic Info / Get Machine Statistics / Get Machine Last Alerts
3. Update Specific Machine Basic Info (write — do reads first)
4. Create New Machine (expect 500 — known sandbox bug)

**Payment / Refunds — sequential flow (currently blocked by 403):**
1. Request a Payment Refund → note the `RefundID`
2. Upload Refund Documentation (attach evidence)
3. Approve Payment Refund OR Decline a Payment Refund (mutually exclusive)

---

## What each folder contains

| Folder | Endpoints | Status (May 2026) |
| --- | --- | --- |
| `Sign In` | 2 | 2/2 pass |
| `Actors` | 20 | 13 pass, 4 fail (403), 3 other |
| `Cards` | 20 | 13 pass, 6 fail, 1 skip — see `Cards/README.md` |
| `Devices` | 4 | 2 pass, 2 fail |
| `EReceipt` | 1 | 0 pass — 403 |
| `Lookups` | 18 | 17 pass, 1 fail (403) |
| `Machine Attribute` | 7 | 6 pass, 1 skip |
| `Machine Inventory` | 6 | 3 pass, 1 fail (500), 2 skip |
| `Machine Products` | 5 | 2 pass, 2 fail, 1 skip |
| `Machines` | 15 | 10 pass, 3 fail, 1 skip — see `Machines/README.md` |
| `Metadata` | 2 | 0 pass — 403 |
| `Payment` | 4 | 0 pass — all 403 — see `Payment/README.md` |
| `Product Groups` | 9 | 4 pass, 4 fail (403 on tax endpoints) |
| `Products` | 4 | 4/4 pass |
| `Report` | 2 | 2/2 pass |
| `Scheduling` | 16 | 0 pass — all 403 |

Folders with a `README.md` have run-order notes and known-behavior details.

---

## What to do after each test

- Fill in the `FILL_IN_AFTER_FIRST_SUCCESSFUL_CALL` placeholders in the example responses.
- If something in the Nayax docs was unclear or missing, add an entry to `gap-log.md` at the root. That file gets shared with Moshe/Yael at Nayax.

---

## Sandbox reference data

Collected during testing — use these values when building requests. Do not guess or use placeholder IDs.

| Field | Value | Notes |
| --- | --- | --- |
| Sandbox base URL | `https://qa-lynx.nayax.com` | Already in env |
| Sandbox ActorID | `2009586082` | Use in all actor-scoped requests |
| Sandbox ActorCode | `1222` | Shorter reference for the same actor |
| Parent Distributor ActorID | `2001312062` | Nayax Integrations |
| CountryID — actor endpoints | `840` | United States, ISO numeric format |
| CountryID — lookup endpoints | `225` | United States, internal Nayax ID |
| CurrencyID | `3` | USD |
| Test NayaxProductID | `999998535696561` | Created in sandbox; use for machine product assignments |
| Valid SalesSourceID | `30000512` | Required for machine creation |
| Valid CardTypeID (prepaid) | `33` | Use in Create Virtual Card and Create New Card v2 |
| Valid CardPhysicalType | `2` | Required for card creation |
| Valid PaymentMethodIDs | `1` (Credit Card), `2` (NFC), `3` (QR) | Reference only — sandbox has no payment methods enabled |
| Test MachineID | `1002524581` | Created during testing; use for machine-specific reads |

---

## Contacts

| Who | Company | What for |
| --- | --- | --- |
| Moshe Orenstein | Nayax | Sandbox access, skill definitions |
| Shaha | Nayax | Creates the sandbox account / NAX ID |
| Yael | Nayax | Gives feedback on doc gaps |
| Heitor Tessaro | WriteChoice | Owns the testing |

---

## Where things are saved

| What | Where |
| --- | --- |
| Bruno collection | `C:\GitHub\nayax-mintlify\nayax-mintlify\api-testing\lynx\` |
| Full written plan | `C:\Users\anays\.claude\plans\velvet-launching-walrus.md` |
| Onboarding docs (txt) | `C:\Users\anays\Downloads\onboarding-docs\` |
| Meeting transcripts | `C:\Users\anays\Downloads\nayax_api_testing___internal_sync.md` and `ai_skills___nayax.md` |
| Reference Bruno collection | `C:\GitHub\pay-fumadocs\docs\bruno-collection\` |
