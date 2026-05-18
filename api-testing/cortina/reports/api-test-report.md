# API Test Report — Cortina

**Date:** 2026-05-15
**Tester:** Anayse Benedito
**Status:** Partial — one Nayax-hosted endpoint confirmed live; all others are integrator-side (not testable outbound).

---

## API architecture

Cortina is primarily an inbound API — Nayax calls the integrator's server. The OpenAPI spec global server is `https://{domain}:{port}` (the integrator's own domain). All `/Cortina/...` endpoints and the onboarding endpoints (`/OnboardActor`, `/OnboardMachine`, `/Version`) are implemented by the integrator.

One exception exists: `/Cortina/{integratorName}/start` has a per-endpoint `servers:` override pointing to `https://lynx.nayax.com/payment/v2/transactions` — **this is a Nayax-hosted endpoint** called by the integrator when a user scans a Static QR code.

---

## Summary

| Endpoint | Direction | Result | Notes |
|----------|-----------|--------|-------|
| POST /Cortina/{integratorName}/start | Integrator → Nayax | **TESTED** | 200 Declined Code 13 — live on both sandbox and production |
| GET /Version | Nayax → Integrator | NOT TESTABLE | Integrator implements this on their server |
| POST /OnboardActor | Nayax → Integrator | NOT TESTABLE | Integrator implements this on their server |
| POST /OnboardMachine | Nayax → Integrator | NOT TESTABLE | Integrator implements this on their server |
| POST /Cortina/StartSession | Nayax → Integrator | NOT TESTABLE | Core auth step; integrator implements |
| POST /Cortina/CreditCard/* (8 endpoints) | Nayax → Integrator | NOT TESTABLE | Integrator implements |
| POST /Cortina/Prepaid/* (6 endpoints) | Nayax → Integrator | NOT TESTABLE | Integrator implements |
| POST /Cortina/DynamicQR/* (4 endpoints) | Nayax → Integrator | NOT TESTABLE | Integrator implements |
| POST /Cortina/StaticQR/* (6 endpoints) | Nayax → Integrator | NOT TESTABLE | Integrator implements |
| POST /Cortina/AgeVerification | Nayax → Integrator | NOT TESTABLE | Integrator implements |
| POST /Cortina/RenewKey | Nayax → Integrator | NOT TESTABLE | Integrator implements |
| POST /Cortina/SaleEndNotification | Nayax → Integrator | NOT TESTABLE | Integrator implements |

---

## POST /Cortina/{integratorName}/start — live test results

**Server:** `https://lynx.nayax.com/payment/v2/transactions` (production)
**Sandbox:** `https://qa-lynx.nayax.com/payment/v2/transactions`

Both hosts are reachable and return JSON responses (not HTML).

**All tested body variations return the same response:**
```json
{"Status":{"Verdict":"Declined","Code":13}}
```

Tested variations:
- Empty body `{}`
- Full body with spec example values (SecretToken, TerminalId, TransactionId, AppUserId)
- Missing individual required fields (SecretToken, TerminalId, TransactionId)
- Different integrator names: `testintegrator`, `nayax`, `cortina`, `test`, `demo`, `unknown123`

**Interpretation:** The `SecretToken` is validated before any other field. Since the test SecretToken is not registered in the system (it's the spec example value), every request declines at token validation with Code 13. No field-level validation errors are exposed without a valid registered SecretToken.

---

## Discrepancies found

| # | Endpoint | What spec/docs say | What API returned | Severity | Action needed |
|---|----------|--------------------|-------------------|----------|---------------|
| 1 | /Cortina/{integratorName}/start | Code 13 not in StaticQR decline table | Code 13 returned on all requests | Medium | Add Code 13 to `staticqr-decline-reasons.mdx` with description (likely "Invalid SecretToken" or "Integrator not found") |
| 2 | GET /Version | Spec uses global server `https://{domain}:{port}` | 404 at `lynx.nayax.com/payment/v2/transactions/Version` | Low | Confirms /Version is integrator-side — no action needed on spec |

---

## What is needed to test integrator-side endpoints

| Prerequisite | Detail |
|---|---|
| Secret Token (66 chars) | Provided by Nayax during integration setup |
| Nayax Integration Engineer | Required to initiate test transactions from Nayax's side |
| Running server | Integrator implements all `/Cortina/...` endpoints |
| Network access | Either VPN to Nayax QA (`31.154.55.2`) or public HTTPS endpoint reachable from that IP |
| Test machine | Configured in Nayax Core by Nayax team |

---

## What to test once the server is running

To validate `/Cortina/{integratorName}/start` fully, a registered `SecretToken` and a real `TerminalId` configured in Nayax Core are required. With those, the expected happy path is:

```json
{"Status":{"Verdict":"Approved"}}
```

The full inbound test sequence (Nayax calls integrator) is:
```
POST /Cortina/StartSession  ← Nayax sends RandomNumber; integrator responds with TranIDCipher
POST /Cortina/CreditCard/Authorization  ← or Sale, or Prepaid/Authorization
POST /Cortina/CreditCard/Settlement  ← or Void/Cancel
POST /Cortina/SaleEndNotification  ← Nayax confirms transaction complete
```
