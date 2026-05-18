# API Test Report — E-Receipt Platform

**Date:** 2026-05-15
**Tester:** Anayse Benedito
**Status:** Blocked — API direction confirmed as provider-side; no Nayax-hosted endpoint exists to call.

---

## Architecture finding — API direction is reversed

After URL discovery attempts across all candidate hosts, the E-Receipt Platform API is **not called by the integrator toward Nayax**. It is called **by Nayax toward the eReceipt provider's server**.

Evidence:
- No `servers:` section in the OpenAPI spec — the URL is not fixed because it is the provider's own server
- `actorInfo.ereceiptProviderUrl` field — each actor has their own eReceipt provider URL configured in their account
- `StartSessionRequest.dynamicURL` field — session-level URL override, confirming the target host is variable
- `security: - {}` — no standard HTTP auth; session auth is handled via `startSessionToken` per call
- All Nayax-controlled hosts (`ereceipt.nayax.com`, `qa-ereceipt.nayax.com`) serve a customer-facing SPA portal for viewing receipts, not an API

**What this spec describes:** The contract a third-party eReceipt provider (e.g. Weezmo) must implement on their own server so that Nayax can call it to generate and retrieve receipts. Similar to how `openapi/cortina.yaml` describes what the Cortina integrator must implement.

---

## Summary

| Endpoint | Result | Reason |
|----------|--------|--------|
| POST /v1/eReceiptPlatform/StartSession | NOT TESTABLE | Nayax calls this on the provider's server |
| POST /v1/eReceiptPlatform/Generate | NOT TESTABLE | Nayax calls this on the provider's server |
| POST /v1/eReceiptPlatform/Refund | NOT TESTABLE | Nayax calls this on the provider's server |
| POST /v1/eReceiptPlatform/Void | NOT TESTABLE | Nayax calls this on the provider's server |
| POST /v1/Gateway/GetReceipt | UNKNOWN | May be Nayax-hosted — needs URL confirmation |
| POST /v1/Retry | UNKNOWN | May be Nayax-hosted — needs URL confirmation |
| POST /v1/GetReceipt | UNKNOWN | May be Nayax-hosted — needs URL confirmation |

---

## URLs probed (all unreachable or wrong type)

| Host | Result |
|------|--------|
| `e-receipt.nayax.com` | DNS not found |
| `ereceipt.nayax.com` | Resolves — SPA customer portal (returns HTML for all paths) |
| `qa-ereceipt.nayax.com` | Resolves — SPA customer portal (returns HTML for all paths) |
| `ereceipt-platform.nayax.com` | DNS not found |
| `nayax-ereceipt-dmz.nayax.com` | DNS not found |
| `ereceipt-api.nayax.com` | DNS not found |
| `qa-lynx.nayax.com` (eReceiptPlatform paths) | Returns Lynx login page HTML (wrong server) |
| `api.nayax.com` | DNS not found |

---

## Note on Gateway and query endpoints

`/v1/Gateway/GetReceipt`, `/v1/Retry`, and `/v1/GetReceipt` may be on Nayax's side (the "gateway" prefix suggests Nayax as the intermediary). These could potentially be called by an integrator to retrieve receipt status after a transaction. However, no working URL was found during probing.

---

## What to test instead — using existing Lynx endpoint

The Lynx API already includes `POST /v1/ereceipt/generate` (at `qa-lynx.nayax.com`), which is Nayax's proxy endpoint for triggering an eReceipt from an integrator's perspective. That endpoint is the correct one to test for integrators — it requires elevated permissions (currently 403 with standard token).

---

## What needs Nayax confirmation

| Question | Why it matters |
|----------|----------------|
| Is the E-Receipt Platform spec for providers to implement (inbound), or for integrators to call (outbound)? | Determines whether testing this spec is in scope at all |
| Is there a sandbox URL for `/v1/Gateway/GetReceipt` and `/v1/GetReceipt`? | These may be on Nayax's side and callable |
| What eReceipt provider is configured in the sandbox operator account? | Needed if building a local server to receive Nayax's eReceipt calls |
| Is the E-Receipt Platform API the same as Weezmo's API? | Context for documentation |

---

## How to test if you are the eReceipt provider

If your integration role is to act as an eReceipt provider (i.e. implement the server Nayax calls), you would:

1. Stand up a local server implementing all 7 endpoints from `openapi/e-receipt.yaml`
2. Register your server URL with Nayax (they set `ereceiptProviderUrl` on your actor account)
3. Nayax calls your server's `StartSession` → `Generate` when a transaction settles
4. Verify the inbound request payloads match the schema in `openapi/e-receipt.yaml`

This is the same pattern as `openapi/cortina.yaml`.
