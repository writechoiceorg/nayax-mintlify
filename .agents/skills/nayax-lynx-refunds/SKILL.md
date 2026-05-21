---
name: nayax-lynx-refunds
description: >-
  Use this skill when a developer is integrating Nayax Lynx API refund workflows, including requesting a refund on a transaction, uploading refund evidence or documentation, approving a refund, or declining a refund. Triggers on keywords such as: refund, refund request, refund approval, refund decline, refund documentation, refund evidence, RefundID, refund-approve, refund-decline, refund-request, refund-documentation, cancel transaction, reverse payment, chargeback evidence. Also use when a developer encounters unexpected HTTP 200 responses with failure bodies, permission errors on refund endpoints, or 500 errors from the approve endpoint in the Lynx sandbox environment.
---

Latest Lynx API version: **v1**.

## Workflow routing

| Trying to… | Endpoint | Reference |
| --- | --- | --- |
| Request a refund on a transaction | `POST /v1/payment/refund-request` | <references/request-refund.md> |
| Upload refund documentation or evidence | `POST /v1/payment/refund-documentation` | <references/request-refund.md> |
| Approve a refund | `POST /v1/payment/refund-approve` | <references/approve-decline.md> |
| Decline a refund | `POST /v1/payment/refund-decline` | <references/approve-decline.md> |

## Critical rules

- **Elevated permissions required**: All four refund endpoints require a permission scope (`refund`) that is NOT included in the standard sandbox token. Without it, Request and Decline return HTTP 200 with `{"Status":"failed"}` in the body, and Approve returns 500. Contact Moshe Orenstein at Nayax to have the `refund` scope added to your token before testing any refund endpoint.
- **The HTTP 200 logical-failure trap**: `POST /v1/payment/refund-request` and `POST /v1/payment/refund-decline` return HTTP 200 even when the operation fails due to missing permissions. The HTTP status code alone cannot be trusted — always inspect the response body for `"Status":"failed"`.
- **Upload documentation before approving**: The approve endpoint will fail if no documentation file is attached to the refund. Always call `POST /v1/payment/refund-documentation` successfully before calling `POST /v1/payment/refund-approve`.
- **Approve and Decline are mutually exclusive**: Once a refund is approved it cannot be declined, and once it is declined it cannot be approved. Do not call both for the same `RefundID`.
- **Approve returns 500 in sandbox**: Even with a valid `RefundID` and correct permissions, the approve endpoint returns 500 and leaks an internal hostname (`qailapi01.nayaxvend.int`) in the sandbox environment. This is a Nayax-side sandbox bug, not a code or integration error. Contact Moshe Orenstein at Nayax to resolve.
- **Upload body is mandatory**: Sending an empty body to `POST /v1/payment/refund-documentation` returns 500. The request must include `FileName`, `FileData` (base64-encoded file content), `TransactionId`, `SiteId`, and `MachineAuTime`.

## Key documentation

- [Refund workflow overview](https://developerhub.nayax.com/manage-data-operations/lynx-api/payment/refunds) — Full endpoint reference for all four refund operations
