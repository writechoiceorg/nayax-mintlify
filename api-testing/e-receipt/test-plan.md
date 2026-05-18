# API Test Plan — E-Receipt (Nayax)

**Date:** —  
**Tester:** Anayse Benedito  
**Product scope:** E-Receipt Platform — digital receipt generation, refund, void, and retrieval  
**OpenAPI spec:** `openapi/e-receipt.yaml`  
**Bruno collection:** `api-testing/e-receipt/collection/`  
**Bruno environment:** `api-testing/e-receipt/collection/environments/sandbox.bru`

## Status

**NOT TESTABLE (outbound) — API direction is provider-side.**

URL discovery was performed on 2026-05-15. Findings:

- The `eReceiptPlatform` endpoints (`/Generate`, `/Refund`, `/Void`, `/StartSession`) are called **by Nayax** on the eReceipt provider's server — not by the integrator toward Nayax.
- The spec has no `servers:` section because the target URL is the provider's own server (`ereceiptProviderUrl` per actor).
- `ereceipt.nayax.com` and `qa-ereceipt.nayax.com` are customer-facing SPA portals, not API servers.
- The `dynamicURL` field in `StartSessionRequest` confirms the URL is session-variable.

This spec describes what a third-party eReceipt provider must implement. Testing it outbound requires standing up a local server and having Nayax call it — same pattern as Cortina.

The `/v1/Gateway/GetReceipt`, `/v1/Retry`, and `/v1/GetReceipt` endpoints may be Nayax-hosted — confirm with Nayax team.

Contact the Nayax team to confirm:
- Whether `/v1/Gateway/GetReceipt`, `/v1/Retry`, `/v1/GetReceipt` are callable by integrators and what the sandbox URL is
- Whether the Lynx `POST /v1/ereceipt/generate` endpoint is the correct integrator-facing alternative

## Available endpoints (from `openapi/e-receipt.yaml`)

| # | Endpoint | Method | Summary |
|---|----------|--------|---------|
| 1 | /v1/eReceiptPlatform/Generate | POST | Generate a new digital receipt |
| 2 | /v1/eReceiptPlatform/Refund | POST | Refund a transaction and update receipt |
| 3 | /v1/eReceiptPlatform/Void | POST | Void a receipt |
| 4 | /v1/eReceiptPlatform/StartSession | POST | Start a receipt session |
| 5 | /v1/Gateway/GetReceipt | GET | Retrieve receipt via gateway |
| 6 | /v1/Retry | POST | Retry a failed receipt operation |
| 7 | /v1/GetReceipt | POST | Retrieve receipt details |

## Additional note

The Lynx API includes a `POST /v1/ereceipt/generate` endpoint that is permission-gated (403 with standard token). This may be a different e-receipt flow from the standalone E-Receipt Platform API above — confirm with the Nayax team whether these two are related or separate systems.

## Suggested test sequence (once base URL and auth are confirmed)

1. POST /v1/eReceiptPlatform/StartSession — establish a session (if required)
2. POST /v1/eReceiptPlatform/Generate — generate a test receipt using a known TransactionId
3. POST /v1/GetReceipt or GET /v1/Gateway/GetReceipt — retrieve the generated receipt
4. POST /v1/eReceiptPlatform/Void — void the receipt from step 2
