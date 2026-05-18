# Payment

Tests for the refund workflow — requesting, reviewing, documenting, and approving or declining payment refunds.

**Status:** 0 pass / 4 fail — all blocked by permissions (4 requests total)

---

## Run Order

Run in this sequence once permissions are granted. Steps 3a and 3b are mutually exclusive.

| # | Request | Notes |
|---|---------|-------|
| 1 | Request a Payment Refund | Creates the refund. Note the returned RefundID for subsequent steps. |
| 2 | Upload Refund Documentation | Attaches supporting evidence. Use the RefundID from step 1. |
| 3a | Approve Payment Refund | Approves the refund. Mutually exclusive with Decline. |
| 3b | Decline a Payment Refund | Declines the refund. Mutually exclusive with Approve. |

---

## Known Behaviors

- **All endpoints return 403 — permissions not granted:** Every request in this folder returns `403 "Insufficient permissions"`. The sandbox token does not have refund workflow permissions. None of these endpoints can be tested until Nayax grants elevated permissions for the sandbox account.
- **Sequential dependency:** These requests must run in order. Approve/Decline both require a RefundID from a prior Request call. Upload Documentation should precede Approve/Decline if evidence is needed.
- **Approve vs. Decline is one-way:** Once a refund is approved or declined, the other action is no longer available. Test one path per RefundID.
