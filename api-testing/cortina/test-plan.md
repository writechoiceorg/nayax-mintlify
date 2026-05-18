# API Test Plan — Cortina (Nayax)

**Date:** —  
**Tester:** Anayse Benedito  
**Product scope:** Cortina — Credit Card, Prepaid, DynamicQR, StaticQR payment APIs  
**OpenAPI spec:** `openapi/cortina.yaml`  
**Bruno collection:** `api-testing/cortina/collection/`

## Important: Direction of requests

**Cortina is a server-side API — Nayax calls the integrator, not the other way around.**

The OpenAPI spec at `openapi/cortina.yaml` defines the API that the integrator must implement on their own server. Nayax's system sends requests TO the integrator's domain (`https://{domain}:{port}`). Bruno cannot be used to test Cortina by making outbound requests to Nayax — there is no Nayax endpoint to call.

This is fundamentally different from Lynx and Ecom.

## What testing looks like for Cortina

To test the Cortina integration:

1. The integrator runs a local server that implements the Cortina endpoints (`/Cortina/StartSession`, `/Cortina/CreditCard/Authorization`, etc.)
2. Nayax's sandbox environment is configured to send requests to the integrator's server (requires VPN or HTTPS endpoint reachable by Nayax QA servers at `31.154.55.2`)
3. The Nayax Integration Engineer initiates test transactions from Nayax's side
4. The integrator's server logs the incoming requests and responds correctly

**Bruno's role here would be to simulate incoming Nayax requests** for local testing of the server implementation — not for testing production endpoints.

## Authentication

Cortina uses AES-256 ECB encryption with PKCS5 padding. Before any transaction:

1. Nayax and the integrator share a **66-character Secret Token** (provided by Nayax during setup)
2. Nayax sends a `StartSession` request with a 27-character random string
3. The integrator generates a 36-digit Transaction ID and encrypts it with the random string using the last 32 characters of the Secret Token as the AES key
4. The integrator responds with the encrypted cipher (`TranIDCipher`)
5. Nayax validates the cipher and uses the Transaction ID for all subsequent requests in that session

See `docs/cortina/start-session/cortina-auth.mdx` for the full step-by-step with examples.

## Available endpoints (from `openapi/cortina.yaml`)

All endpoints below are implemented by the integrator and called by Nayax:

| Group | Endpoint | Method |
|-------|----------|--------|
| Session | /Cortina/StartSession | POST |
| Credit Card | /Cortina/CreditCard/Authorization | POST |
| Credit Card | /Cortina/CreditCard/Sale | POST |
| Credit Card | /Cortina/CreditCard/Settlement | POST |
| Credit Card | /Cortina/CreditCard/Void | POST |
| Credit Card | /Cortina/CreditCard/Cancel | POST |
| Credit Card | /Cortina/CreditCard/Refund | POST |
| Credit Card | /Cortina/CreditCard/IncrementalAuth | POST |
| Credit Card | /Cortina/CreditCard/Inquiry3DS | POST |
| Prepaid | /Cortina/Prepaid/Authorization | POST |
| Prepaid | /Cortina/Prepaid/Sale | POST |
| Prepaid | /Cortina/Prepaid/Settlement | POST |
| Prepaid | /Cortina/Prepaid/Void | POST |
| Prepaid | /Cortina/Prepaid/Cancel | POST |
| Prepaid | /Cortina/Prepaid/Refund | POST |
| Dynamic QR | /Cortina/DynamicQR/GenerateQR | POST |
| Dynamic QR | /Cortina/DynamicQR/Inquiry | POST |
| Dynamic QR | /Cortina/DynamicQR/Void | POST |
| Dynamic QR | /Cortina/DynamicQR/Refund | POST |
| Static QR | /Cortina/StaticQR/Authorization | POST |
| Static QR | /Cortina/StaticQR/Sale | POST |
| Static QR | /Cortina/StaticQR/Settlement | POST |
| Static QR | /Cortina/StaticQR/Void | POST |
| Static QR | /Cortina/StaticQR/Cancel | POST |
| Static QR | /Cortina/StaticQR/Refund | POST |
| Utility | /Cortina/AgeVerification | POST |
| Utility | /Cortina/RenewKey | POST |
| Utility | /Cortina/SaleEndNotification | POST |
| Integrator | /Cortina/{integratorName}/start | POST |
| Onboarding | /OnboardActor | POST |
| Onboarding | /OnboardMachine | POST |
| Onboarding | /Version | GET |

## Prerequisites for testing

- [ ] Nayax Integration Engineer assigned (kickoff required)
- [ ] Secret Token received from Nayax (66 characters, test environment)
- [ ] Integrator server running and reachable from Nayax QA (`31.154.55.2`) OR VPN tunnel established
- [ ] Test machine configured in Nayax Core by Nayax team
- [ ] AES encryption implemented in server code (ECB mode, PKCS5 padding, 256-bit key from last 32 chars of Secret Token)

## Reference docs

- `docs/cortina/start-session/cortina-auth.mdx` — authentication process with examples
- `docs/cortina/network-requirements.mdx` — IP whitelist and VPN setup
- `docs/cortina/cortina-integration.mdx` — full integration process (8-stage)
- `docs/cortina/credit-card/cortina-credit-card-flows.mdx` — transaction flow diagrams
