# API Test Plan — Ecom SDK (Nayax)

**Date:** —  
**Tester:** Anayse Benedito  
**Product scope:** Nayax Ecom SDK — e-commerce transactions (CIT, MIT, COF), card token management  
**OpenAPI spec:** `openapi/ecom.yaml`  
**Bruno collection:** `api-testing/ecom/collection/`  
**Bruno environment:** `api-testing/ecom/collection/environments/sandbox.bru`

## Status

**BLOCKED — Sign Key and IntegratorId required from Nayax.**

Contact the Nayax Ecom team to receive:
- **Sign Key** (typically 16 characters) — used to compute the per-request HMAC-SHA256 signature
- **Sign Key ID** (numeric) — sent as the `IntegratorId` header
- **Secret Token** (66 characters) — used specifically for `/validate-merchant`
- A sandbox `machineId` (34-digit string, e.g. `0434334921100366`) configured for Ecom

## Base URL

Use the **stable** environment for integration and testing:

```
https://stable-sdk-api.nayax.com/
```

Production is `https://api.nayax.com/sdk` — do not use for testing.

Some docs also reference `https://api-sandbox.nayax.com/ecom/` — confirm with Nayax which is active.

## Authentication

Every request to the Ecom SDK API requires two headers computed from the request body:

| Header | Value |
|--------|-------|
| `IntegratorId` | Your Sign Key ID (numeric) |
| `Signature` | SHA-256 hash of: minified JSON body + ";" + Sign Key |

**Computing the Signature:**

1. Serialize the request body to minified JSON (no whitespace)
2. Concatenate: `{minifiedJson};{signKey}`
3. Hash with SHA-256 (UTF-8 encoded)
4. Use the hex digest as the `Signature` header

Example (from docs):
```
{"TokenId":116383,"actorId":"0434334921100366",...};RbtdDsiVNjkAeRty
→ SHA256 → 536a5813206bcb663d98715d10a6b2612364245c865cdd5f781ff4428c4a6137
```

Note: This signature must be recomputed for every request. Bruno does not support per-request scripting out of the box — use PowerShell to compute the signature and include it manually in Bruno requests.

Fill in `sandbox.bru` with:
```
vars {
  base_url: https://stable-sdk-api.nayax.com
  sign_key: {your-sign-key}
  integrator_id: {your-sign-key-id}
  machine_id: {your-machine-id}
  secret_token: {your-secret-token}
}
```

## Available endpoints (from `openapi/ecom.yaml`)

| # | Endpoint | Method | Summary | Needs active tx? |
|---|----------|--------|---------|-----------------|
| 1 | /test/connection | GET | Connectivity check | No |
| 2 | /initialize | POST | Initialize a new transaction, returns payment page URL or session | No |
| 3 | /charge-token | POST | Charge a stored card token (MIT/COF) | Yes (token) |
| 4 | /get-card-token | GET | Retrieve card token details | Yes (token) |
| 5 | /delete-token | DELETE | Delete a stored card token | Yes (token) |
| 6 | /get-transaction-by-session | GET | Get transaction status by session ID | Yes (session) |
| 7 | /validate-merchant | POST | Apple Pay merchant validation | No (needs Secret Token) |
| 8 | /close-transaction | POST | Close or cancel an active session | Yes (session) |

> `/initialize-1` is in the spec but empty — excluded.

> Webhook endpoints (`/webhook`, `/callback`) are called by Nayax to the integrator's server — exclude from outbound testing.

## Tested without credentials (2026-05-15)

- GET /test/connection → **200 OK** (no auth required, returns "OK")
- POST /initialize → **Declined code 997** if `validationKey` missing; **Declined code 998** if UUID provided but `/validate-merchant` was not called first
- `IntegratorId` / `Signature` headers are NOT validated on `/initialize` — those headers are consumed by `/validate-merchant`

## Correct test sequence (once credentials are available)

The `/initialize` endpoint depends on `/validate-merchant` — the UUID you generate must be registered there first.

1. GET /test/connection — confirm sandbox reachability (confirmed working without credentials)
2. POST /validate-merchant — authenticate the session using Secret Token + Sign Key; pass a fresh UUID as the `Cipher`
3. POST /initialize — create a transaction using the same UUID as `validationKey`, capture session ID and payment URL
4. GET /get-transaction-by-session — retrieve status using session from step 3
5. POST /close-transaction — close the session from step 3

Token-based flows (charge-token, get-card-token, delete-token) require completing a card-on-file transaction first. Test in a second pass after steps 1–5 work.

### initialize request body structure (confirmed from live response)

```json
{
  "machineInfo": { "machineId": "YOUR_MACHINE_ID" },
  "basicInfo": {
    "amount": 1,
    "currency": "USD",
    "countryCode": "US",
    "requestType": 0,
    "redirectURL": "https://your-server.com/callback",
    "sessionExpiration": "2026-12-31T23:59:59Z",
    "merchantRequestId": "unique-request-id"
  },
  "cardHolderInfo": { "cardholderEmail": "test@example.com" },
  "validationKey": "UUID-GENERATED-PER-SESSION"
}
```

## PowerShell helper for Signature computation

```powershell
function Get-EcomSignature($body, $signKey) {
    $payload = $body + ";" + $signKey
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
    $sha256 = [System.Security.Cryptography.SHA256]::Create()
    $hash = $sha256.ComputeHash($bytes)
    return ($hash | ForEach-Object { "{0:x2}" -f $_ }) -join ""
}

$body = '{"actorId":"0434334921100366","MachineId":1}'
$sig = Get-EcomSignature $body "RbtdDsiVNjkAeRty"
Write-Host "Signature: $sig"
```

## Reference docs

- `docs/ecom-sdk/security-authentication/ecom-security-authentication.mdx` — full auth walkthrough
- `docs/ecom-sdk/back-end-integration/ecom-sdk-back-end-integration.mdx` — API architecture
- `docs/ecom-sdk/get-started/ecom-sdk-get-started.mdx` — onboarding overview
