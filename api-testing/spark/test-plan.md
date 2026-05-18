# API Test Plan — Spark (Nayax)

**Date:** 2026-05-15
**Tester:** Anayse Benedito
**Product scope:** Spark — RemoteStart V2
**OpenAPI spec:** `openapi/spark.yaml`
**Bruno collection:** `api-testing/spark/collection/`
**Bruno environment:** `api-testing/spark/collection/environments/sandbox.bru`

---

## Architecture

Spark is a **bidirectional** API. The spec defines both sides:

**Integrator calls Nayax** (`nayax-spark-dmz.nayax.com/api`):
- `GET /Version` — no auth, confirmed working
- `POST /StartAuthentication` — requires AES cipher + Sign Key
- `POST /TriggerTransaction` — requires active SparkTransactionId + physical device
- `POST /ExternalCancel` — requires NayaxTransactionId from a live transaction
- `POST /ExternalSettlement` — requires NayaxTransactionId from a live transaction
- `POST /CancelTransaction` — requires active SparkTransactionId
- `POST /Settlement` — requires active SparkTransactionId

**Nayax calls the integrator** (your server — implement these):
- `POST /StartSession`
- `POST /InfoQuery`
- `POST /AvailabilityCheck`
- `POST /TransactionCallback`
- `POST /TransactionNotify`
- `POST /TimeoutCallback`
- `POST /StopNotify`
- `POST /StopCallback`
- `POST /DeclineCallback`

---

## Authentication

Two HTTP headers required on all POST requests:

| Header | Value |
|--------|-------|
| `IntegratorId` | Your Sign Key ID (numeric) |
| `TransactionSignature` | SHA-256(`{SparkTransactionId};{SignKey}`, UTF-8) |

### Cipher for /StartAuthentication

Build a 64-character plaintext string:

| Part | Characters | Value |
|------|-----------|-------|
| SparkTransactionId | 1–36 | Fresh UUID per session |
| Separator | 37 | `=` |
| Random string | 38–54 | 17-char alphanumeric |
| Timestamp | 55–64 | Current UTC in `YYMMDDhhmm` |

Encrypt with **AES-256 ECB** using the **last 32 characters** of the Secret Token as the key. Base64-encode the result.

The timestamp has a **5-minute validity window** — sync your server clock to UTC.

**PowerShell helper for TransactionSignature:**

```powershell
function Get-SparkSignature($sparkTransactionId, $signKey) {
    $payload = "$sparkTransactionId;$signKey"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
    $sha256 = [System.Security.Cryptography.SHA256]::Create()
    $hash = $sha256.ComputeHash($bytes)
    return ($hash | ForEach-Object { "{0:x2}" -f $_ }) -join ""
}

$sig = Get-SparkSignature "12c7cec2-c690-4425-9a1f-db0db60e2d8c" "YourSignKey"
Write-Host "TransactionSignature: $sig"
```

---

## Base URL

| Environment | URL |
|-------------|-----|
| Sandbox / integration | `https://nayax-spark-dmz.nayax.com/api` |
| Production | `https://api.nayax.com` (do not use for testing) |

Note: The docs show `api.nayax.com` in curl examples — confirm which host is correct for sandbox with Nayax.

---

## Prerequisites checklist

- [ ] Sign Key (16 chars) received from Nayax
- [ ] Sign Key ID (numeric) received from Nayax
- [ ] Secret Token (66 chars) received from Nayax
- [ ] Token ID (numeric) received from Nayax
- [ ] `sandbox.bru` filled in with credentials
- [ ] A physical Nayax terminal configured for Spark (HW serial number known)
- [ ] Integrator server running to receive inbound callbacks (`/TransactionCallback`, `/StartSession`, etc.)
- [ ] Nayax has the integrator's callback URL configured

---

## Test sequence (once credentials are available)

Step 1 and 2 only require credentials. Steps 3+ require a physical device.

1. **GET /Version** — confirm sandbox is reachable (confirmed — no credentials needed)
2. **POST /StartAuthentication** — authenticate; capture `SparkTransactionId` from response
3. **POST /TriggerTransaction** — wake physical terminal; wait for card tap
4. **(Inbound) /TransactionCallback** — Nayax sends card auth result to your server; capture `NayaxTransactionId`
5. **POST /Settlement** — settle using `SparkTransactionId` + `NayaxTransactionId`
   — or —
   **POST /ExternalCancel** — if cancelling instead of settling

For ExternalCancel/ExternalSettlement (alternative flow without a full Spark session):
- These only need a `NayaxTransactionId` and `SiteId` from any prior real transaction
- Can be tested in isolation once you have a live transaction from another source

---

## Available endpoints

| # | Endpoint | Method | Direction | Needs device? |
|---|----------|--------|-----------|---------------|
| 1 | /Version | GET | → Nayax | No — confirmed working |
| 2 | /StartAuthentication | POST | → Nayax | No (but needs credentials) |
| 3 | /TriggerTransaction | POST | → Nayax | Yes |
| 4 | /ExternalCancel | POST | → Nayax | Needs NayaxTransactionId |
| 5 | /ExternalSettlement | POST | → Nayax | Needs NayaxTransactionId |
| 6 | /CancelTransaction | POST | → Nayax | Yes |
| 7 | /Settlement | POST | → Nayax | Yes |
| 8 | /StartSession | POST | Nayax → | Implement on your server |
| 9 | /InfoQuery | POST | Nayax → | Implement on your server |
| 10 | /AvailabilityCheck | POST | Nayax → | Implement on your server |
| 11 | /TransactionCallback | POST | Nayax → | Implement on your server |
| 12 | /TransactionNotify | POST | Nayax → | Implement on your server |
| 13 | /TimeoutCallback | POST | Nayax → | Implement on your server |
| 14 | /StopNotify | POST | Nayax → | Implement on your server |
| 15 | /StopCallback | POST | Nayax → | Implement on your server |
| 16 | /DeclineCallback | POST | Nayax → | Implement on your server |

---

## Reference docs

- `docs/integrate-pos-device/spark/security-authentication/spark-authentication.mdx` — auth header details
- `docs/integrate-pos-device/spark/payment-flows/transaction-flows-spark.mdx` — full flow diagrams
- `docs/integrate-pos-device/spark/payment-flows/external-cancel.mdx` — ExternalCancel flow
- `docs/integrate-pos-device/spark/payment-flows/external-settlement.mdx` — ExternalSettlement flow
- `docs/integrate-pos-device/spark/sample-codes/spark-authentication-code-sample.mdx` — cipher code examples
