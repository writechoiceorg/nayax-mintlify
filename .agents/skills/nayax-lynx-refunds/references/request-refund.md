# Request Refund and Upload Documentation

## When to use

Use these two endpoints together at the start of every refund workflow. Call `POST /v1/payment/refund-request` to open a refund case on a transaction and obtain a `RefundID`. Then call `POST /v1/payment/refund-documentation` to attach supporting evidence before the refund can be approved. Both steps must succeed before moving to the approve or decline step.

## How to do it

**Step 1 — Request the refund**

`POST /v1/payment/refund-request`

```json
{
  "TransactionId": "<transaction_id>",
  "RefundAmount": 10.00,
  "Reason": "Customer request"
}
```

On success the response body contains a `RefundID`. Save this value — it is required for the Upload Documentation, Approve, and Decline calls.

**Step 2 — Upload refund documentation**

`POST /v1/payment/refund-documentation`

```json
{
  "FileName": "evidence.pdf",
  "FileData": "<base64-encoded file content>",
  "TransactionId": "<transaction_id>",
  "SiteId": "<site_id>",
  "MachineAuTime": "<timestamp>"
}
```

On success the response body contains a `FileURL` confirming the file was stored. Once this call succeeds, the refund is ready to be approved or declined.

**Step 3 — Proceed to approve or decline**

See `references/approve-decline.md`.

## Traps to avoid

- **HTTP 200 does not mean success.** Both Request Refund and Decline Refund return HTTP 200 even when the operation fails due to missing permissions. Always read the response body. If it contains `"Status":"failed"`, the operation did not succeed — for example: `{"Result":"You are not allowed to view this content or transaction credentials are invalid for transaction_id: X","Status":"failed"}`.
- **Missing permissions return a 200 logical failure.** The `refund` permission scope is not included in the standard sandbox token. If you receive a `"Status":"failed"` body on what looks like a well-formed request, the token lacks the required scope. Contact Moshe Orenstein at Nayax to have the `refund` scope added.
- **Do not call Approve before uploading documentation.** The approve endpoint expects evidence to be attached to the refund. Skipping the Upload Documentation step will cause the approve call to fail.
- **Empty body on Upload returns 500.** All five fields (`FileName`, `FileData`, `TransactionId`, `SiteId`, `MachineAuTime`) are required. Omitting any field or sending an empty body returns a 500 error.
- **FileData must be base64-encoded.** Sending raw binary content in the `FileData` field will fail. Encode the file to base64 before including it in the request body.
- **Store the RefundID immediately.** The `RefundID` returned by the Request step is the key that links all subsequent calls. If it is lost there is no other way to retrieve it from this endpoint — you would need to look it up through a separate transaction query.
