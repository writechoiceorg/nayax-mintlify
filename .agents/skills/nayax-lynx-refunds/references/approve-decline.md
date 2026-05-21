# Approve or Decline a Refund

## When to use

Use these endpoints as the final step of the refund workflow, after a refund has been requested and documentation has been uploaded. Call `POST /v1/payment/refund-approve` to process the refund back to the customer, or `POST /v1/payment/refund-decline` to reject the refund case. Only one of these calls should ever be made per `RefundID` — they are mutually exclusive.

## How to do it

**Approve a refund**

`POST /v1/payment/refund-approve`

```json
{
  "RefundID": "<refund_id>"
}
```

On success the refund is processed. Note: in the current sandbox environment this endpoint returns 500 regardless of input validity — see Traps below.

**Decline a refund**

`POST /v1/payment/refund-decline`

```json
{
  "RefundID": "<refund_id>",
  "Reason": "Duplicate request"
}
```

On success the refund case is closed as declined. Note: this endpoint returns HTTP 200 with a logical-failure body when permissions are insufficient — always check the response body.

## Traps to avoid

- **Approve and Decline are mutually exclusive.** Once `refund-approve` is called for a `RefundID`, calling `refund-decline` for the same ID will fail, and vice versa. Decide which outcome is intended before calling either endpoint.
- **Approve requires documentation to be uploaded first.** If `POST /v1/payment/refund-documentation` was not called successfully before `refund-approve`, the approve call will fail. Confirm the Upload Documentation step returned a `FileURL` before proceeding.
- **Approve returns 500 in the sandbox environment.** Even with a valid `RefundID` and the correct `refund` permission scope, `refund-approve` returns 500 in sandbox and leaks an internal hostname (`qailapi01.nayaxvend.int`) in the error body. This is a Nayax-side sandbox infrastructure bug, not an issue with the request. Contact Moshe Orenstein at Nayax to have this resolved before testing the approval flow end-to-end.
- **Decline returns HTTP 200 on logical failure.** Like Request Refund, the Decline endpoint returns HTTP 200 even when the operation fails due to missing permissions. A response body of `{"Status":"failed"}` means the decline did not go through. Do not treat an HTTP 200 from this endpoint as confirmation of success.
- **Missing permissions affect both endpoints.** The `refund` permission scope must be present on the token. Without it, Decline returns a 200 logical failure and Approve returns 500. Contact Moshe Orenstein at Nayax to have the scope added to your sandbox token.
- **The RefundID comes from the Request step.** There is no way to supply a `RefundID` without first calling `POST /v1/payment/refund-request`. If the approve or decline call is failing with an invalid-ID error, verify the Request step completed successfully and that the `RefundID` was captured from its response body.
