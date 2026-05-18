# API Test Report — Ecom SDK

**Date:** 2026-05-15
**Tester:** Anayse Benedito
**Status:** Partial — connectivity and error behavior confirmed; blocked on credentials for full flow.

---

## API architecture note

The Ecom SDK API uses a session-based auth model. The `validationKey` in every request is not a static credential — it is a per-session UUID that must be pre-registered via `/validate-merchant` using AES-256 ECB cipher before it can be used in `/initialize` or any other call.

---

## Summary

| Endpoint | Method | Result | Notes |
|----------|--------|--------|-------|
| /test/connection | GET | **PASS** | 200 OK, body: "OK" |
| /initialize | POST | **PARTIAL** | Schema validation confirmed; session key check blocked on credentials |
| /validate-merchant | POST | **BLOCKED** | 200 Declined 999 — cipher validation fails without real Secret Token |
| /charge-token | POST | **PARTIAL** | Field validation confirmed (tokenModel required); session check blocked |
| /get-card-token | POST | **BLOCKED** | 200 Declined 998 — session key check |
| /delete-token | POST | **BLOCKED** | 200 Declined 998 — session key check |
| /get-transaction-by-session | POST | **BLOCKED** | 200 Declined 998 — session key check |
| /close-transaction | POST | **BLOCKED** | 200 Declined 998 — session key check |
| /initialize-1 | POST | **NOT TESTED** | 404 — dead endpoint, spec artifact |

---

## What was confirmed

### GET /test/connection
- 200 OK, body: `"OK"` (plain text, no JSON)
- No auth required
- Spec documents response value as `"Connection Successful"` — actual value is `"OK"`. Minor spec mismatch.

### POST /initialize — schema validation
Two distinct error formats exist depending on where validation fails:

**Schema-level validation (missing required object fields like `machineInfo`):**
Returns HTTP 400 with ASP.NET `ProblemDetails` format — **not** the `Status` schema documented in the spec:
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": { "MachineInfo": ["The MachineInfo field is required."] },
  "traceId": "00-..."
}
```

**Business-level validation (missing session fields like `validationKey`):**
Returns HTTP 200 with `Declined` status — matches the documented `Status` schema:
```json
{
  "paymentInfo": null,
  "sessionInfo": null,
  "appInfo": null,
  "status": {
    "verdict": "Declined",
    "code": 997,
    "statusMessage": "Did not receive mandatory parameters - InitializeRequestValidator No ValidationKey",
    "customDeclineCode": null
  }
}
```

The `statusMessage` in live responses is more specific than spec examples show — it includes the validator name and field name (e.g. `InitializeRequestValidator No ValidationKey`).

**UUID validationKey without prior /validate-merchant:**
```json
{
  "paymentInfo": null,
  "sessionInfo": null,
  "appInfo": null,
  "status": {
    "verdict": "Declined",
    "code": 998,
    "statusMessage": "GetSdkTransactionKey Failed",
    "customDeclineCode": null
  }
}
```

### POST /validate-merchant — error behavior
All requests without a valid cipher return 200 Declined 999 `General Error` — no field-level validation errors are surfaced. The server declines at the cipher decryption stage before checking individual fields.

### POST /charge-token — field validation
`tokenModel` is required even when `entryMode` is MIT (1) or CIT (2). Spec marks it as conditional (mandatory only for COF). Omitting it returns:
```json
{
  "status": {
    "verdict": "Declined",
    "code": 997,
    "statusMessage": "Did not receive mandatory parameters - ChargeTokenRequestValidator No BasicInfo.TokenModel"
  }
}
```
Adding `tokenModel` moves past this to 998 session key check.

---

## Discrepancies found

| # | Endpoint | What spec says | What API returned | Severity | Action needed |
|---|----------|----------------|-------------------|----------|---------------|
| 1 | /test/connection | Response value: `"Connection Successful"` | Actual value: `"OK"` | Low | Update spec example value |
| 2 | /initialize | 400 returns `Status` schema (`verdict`/`code`) | 400 returns ASP.NET `ProblemDetails` when a required schema field is missing | Medium | Document both 400 formats; add `ProblemDetails` to spec |
| 3 | /initialize | `statusMessage` is short in spec examples | Actual includes validator + field name (e.g. `InitializeRequestValidator No ValidationKey`) | Low | Update spec examples with real messages |
| 4 | /charge-token | `tokenModel` conditional — mandatory only for COF | Server requires it for MIT/CIT entryModes too | Medium | Mark `tokenModel` as required in spec (not conditional) |
| 5 | /initialize-1 | Defined as empty path in spec | Returns 404 | Low | Remove `/initialize-1` from spec |

---

## Endpoints not testable without credentials

All POST endpoints beyond `/test/connection` require a valid `validationKey` sourced from `/validate-merchant`, which in turn requires:

| Credential | Used for |
|------------|----------|
| Token ID (numeric) | `tokenId` field in `/validate-merchant` |
| Secret Token (66 chars) | AES-256 ECB cipher key (last 32 chars) |
| Machine ID (34-char string) | `machineId` in all requests |

Token-based flows (`/charge-token`, `/get-card-token`, `/delete-token`) additionally require a `nayaxTokenId` from a completed COF transaction.

---

## Flow dependency chain

```
POST /validate-merchant (Secret Token + cipher)
  ↓ returns customDeclineCode = HashedEcomTransactionId (use as validationKey)
POST /initialize (validationKey = HashedEcomTransactionId)
  ↓ returns nayaxSessionId + payment page URL
  [user completes payment on page]
POST /get-transaction-by-session (nayaxSessionId)
  ↓ confirms transaction status
POST /close-transaction (transactionId + transactionTimeUtc from auth response)
```

Card-on-file flow additionally returns `nayaxTokenId` from `/initialize` (COF entryMode), enabling:
```
POST /charge-token  (nayaxTokenId)
POST /get-card-token (nayaxTokenId)
POST /delete-token  (nayaxTokenId)
```
