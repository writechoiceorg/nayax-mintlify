# API Test Report — Spark

**Date:** 2026-05-15
**Tester:** Anayse Benedito
**Status:** Partial — connectivity confirmed, all POST endpoints blocked on credentials.

---

## API architecture

Spark is a **bidirectional** API. The OpenAPI spec defines both sides:

| Direction | Endpoints | Tested? |
|-----------|-----------|---------|
| Integrator → Nayax (`nayax-spark-dmz.nayax.com/api`) | `/Version`, `/StartAuthentication`, `/TriggerTransaction`, `/ExternalCancel`, `/ExternalSettlement`, `/CancelTransaction`, `/Settlement` | Partial — see below |
| Nayax → Integrator (your server) | `/StartSession`, `/InfoQuery`, `/AvailabilityCheck`, `/TransactionCallback`, `/TransactionNotify`, `/TimeoutCallback`, `/StopNotify`, `/StopCallback`, `/DeclineCallback` | Not testable outbound |

---

## Summary

| Endpoint | Method | Result | Notes |
|----------|--------|--------|-------|
| /Version | GET | **PASS** | 200 OK — `{"ProductVersion":"26.2.961.0","Copyright":"Spark.Dmz"}` |
| /StartAuthentication | POST | **BLOCKED** | 401, empty body — auth validated before any field checks |
| /TriggerTransaction | POST | **BLOCKED** | 401, empty body |
| /ExternalCancel | POST | **BLOCKED** | 401, empty body |
| /ExternalSettlement | POST | **BLOCKED** | 401, empty body |
| /CancelTransaction | POST | **BLOCKED** | 401, empty body |
| /Settlement | POST | **BLOCKED** | 401, empty body |
| /StartSession | POST | NOT TESTED | Nayax calls your server — implement on integrator side |
| /InfoQuery | POST | NOT TESTED | Nayax calls your server — implement on integrator side |
| /AvailabilityCheck | POST | NOT TESTED | Nayax calls your server — implement on integrator side |
| /TransactionCallback | POST | NOT TESTED | Nayax calls your server — implement on integrator side |
| /TransactionNotify | POST | NOT TESTED | Nayax calls your server — implement on integrator side |
| /TimeoutCallback | POST | NOT TESTED | Nayax calls your server — implement on integrator side |
| /StopNotify | POST | NOT TESTED | Nayax calls your server — implement on integrator side |
| /StopCallback | POST | NOT TESTED | Nayax calls your server — implement on integrator side |
| /DeclineCallback | POST | NOT TESTED | Nayax calls your server — implement on integrator side |

---

## What was confirmed

### GET /Version
- **URL:** `https://nayax-spark-dmz.nayax.com/api/Version`
- **Response:** `{"ProductVersion":"26.2.961.0","Copyright":"Spark.Dmz"}`
- No auth required. Consistent across both test dates (2026-05-15).

### POST endpoints — auth behavior (tested 2026-05-15)
All POST endpoints return **HTTP 401 with empty body** regardless of:
- No auth headers at all
- `IntegratorId` only
- `TransactionSignature` only
- Both headers with a properly computed SHA-256 signature (valid format, unregistered credentials)
- Full request body matching the spec schema
- Empty body `{}`

**The 401 body is always empty.** No error message, no hint about which header is missing or wrong.

Response headers on 401:
```
Content-Type: application/json
Content-Length: 0
Server: volt-adc
x-volterra-location: sp4-sao
x-envoy-upstream-service-time: ~1200ms
```

The server is **Volterra ADC** (a WAF/load balancer), routing from São Paulo, Brazil. The upstream service time (~1200ms) confirms requests reach the backend application before being rejected — auth validation happens in the application layer, not the gateway.

**Field validation does not fire before auth.** No way to probe request schema correctness without valid credentials.

### POST /Version — method check
`POST /Version` returns 401 (not 405 Method Not Allowed). The auth middleware intercepts before method routing — this means no endpoint is reachable at all without valid credentials.

---

## Request schemas (from spec — for reference when credentials are available)

### POST /StartAuthentication
```json
{
  "TokenId": 0,
  "TerminalId": "HW_SERIAL",
  "TerminalIdType": 1,
  "Random": "17_CHAR_ALPHANUMERIC",
  "Cipher": "BASE64_AES256ECB"
}
```
`Cipher` construction: AES-256 ECB, key = last 32 chars of Secret Token, plaintext = `SparkTransactionId(36) + "=" + Random(17) + UTC_YYMMDDhhmm(10)`. 5-minute validity window.

### POST /TriggerTransaction
```json
{
  "SparkTransactionId": "UUID_FROM_START_AUTH",
  "TerminalId": "HW_SERIAL",
  "Amount": 0.00,
  "TransactionTimeout": 60
}
```

### POST /ExternalCancel
```json
{
  "NayaxTransactionId": 0,
  "TerminalId": "HW_SERIAL",
  "TerminalIdType": 1,
  "CancellationType": 1,
  "ReasonCode": 75,
  "ReasonText": "Service not provided",
  "CancelAmount": 0
}
```

### POST /ExternalSettlement
```json
{
  "NayaxTransactionId": 0,
  "TerminalId": "HW_SERIAL",
  "TerminalIdType": 1,
  "Amount": 0.00
}
```

### POST /CancelTransaction
```json
{
  "NayaxTransactionId": 0,
  "SparkTransactionId": "UUID",
  "SiteId": 0,
  "MachineAuTime": "",
  "TerminalId": "HW_SERIAL",
  "TerminalIdType": 1,
  "CancellationType": 1,
  "ReasonCode": 75,
  "ReasonText": "Service not provided",
  "CancelAmount": 0
}
```

### POST /Settlement
```json
{
  "NayaxTransactionId": 0,
  "SparkTransactionId": "UUID",
  "SiteId": 0,
  "TerminalId": "HW_SERIAL",
  "Amount": 0.00
}
```

---

## Credentials needed to proceed

| Credential | Used for | Source |
|------------|---------|--------|
| Sign Key (16 chars) | `TransactionSignature` header | Nayax |
| Sign Key ID (numeric) | `IntegratorId` header | Nayax |
| Secret Token (66 chars) | AES cipher key for `/StartAuthentication` | Nayax |
| Token ID (numeric) | `TokenId` field in `/StartAuthentication` body | Nayax |
| TerminalId (HW serial) | Target device in all session endpoints | Physical device configured by Nayax |

---

## Flow dependency chain

Testing beyond `/Version` requires completing this sequence:

```
POST /StartAuthentication  (credentials + AES cipher)
  ↓ returns SparkTransactionId
POST /TriggerTransaction   (requires physical terminal)
  ↓ Nayax calls integrator /TransactionCallback with NayaxTransactionId
POST /Settlement           (SparkTransactionId + NayaxTransactionId)
  — or —
POST /CancelTransaction    (SparkTransactionId + NayaxTransactionId)
```

`/ExternalCancel` and `/ExternalSettlement` can be tested independently once you have a `NayaxTransactionId` from any live transaction — they do not require a Spark-managed session.

---

## Inbound endpoints (Nayax → Integrator)

These 9 endpoints must be implemented on the integrator's server. Nayax sends requests to your HTTPS endpoint when transactions occur.

| Endpoint | Key inbound fields |
|----------|--------------------|
| /StartSession | HwSerial, MachineId, TokenId, Random |
| /InfoQuery | HwSerial, MachineId, SparkTransactionId, SiteId |
| /AvailabilityCheck | HwSerial, MachineId, SparkTransactionId, SiteId |
| /TransactionCallback | NayaxTransactionId, SparkTransactionId, SiteId, TerminalId, AuthStatus, CardHash, Amount |
| /TransactionNotify | NayaxTransactionId, SparkTransactionId, HwSerial, MachineId, Amount, CardHash, SiteId |
| /TimeoutCallback | SparkTransactionId, TerminalId, MachineId, HwSerial |
| /StopNotify | StopSiteId, MachineId, HwSerial, CardHash |
| /StopCallback | StopSiteId, MachineId, HwSerial, CardHash, SparkTransactionId |
| /DeclineCallback | MachineId, HwSerial, SparkTransactionId, Status |
