# Machines

Tests for vending machine management — listing, searching, retrieving statistics and alerts, and managing payment methods.

**Status:** 10 pass / 3 fail / 1 skip (15 requests total)

---

## Run Order

| # | Request | Notes |
|---|---------|-------|
| 1 | Get All Machine Basic Info | Baseline — lists all machines for the operator. |
| 2 | Get Specific Machine Basic Info | Use MachineID `1002524581`. |
| 3 | Search Machine Basic Info | — |
| 4 | Get Machine Basic Info by Device | May return empty due to DeviceID=0 issue — see Known Behaviors. |
| 5 | Get Machine Basic Info by VPOS | — |
| 6 | Get Machine Last Alerts | — |
| 7 | Get Machine Change Logs | — |
| 8 | Get Last Sales for Machine | — |
| 9 | Get Specific Machine Statistics | — |
| 10 | Get Payment Methods for Machine | — |
| 11 | Update Specific Machine Basic Info | Write operation — run all reads first. |
| 12 | Create New Machine | Expect 500 — known server bug, no error body returned. |
| 13 | Create Payment Methods for Machine | Expect 400 `create_payment_method_not_available` — sandbox config gap. |
| 14 | Update Payment Methods for Machine | Expect 400 `create_payment_method_not_available` — sandbox config gap. |
| 15 | Delete Payment Method for Machine | Skip — blocked by creation failure above. |

---

## Known Behaviors

- **Create New Machine — 500 with no body:** The server returns 500 and no error detail. This is a Nayax server-side bug, not a request issue. Cannot diagnose without vendor input.
- **Create / Update Payment Methods — 400 sandbox gap:** Both write endpoints return `400 "create_payment_method_not_available"` because no payment methods are enabled for the sandbox operator. This is a sandbox configuration limitation, not an API defect.
- **Delete Payment Method — skipped:** Blocked by the creation failure above. No payment method exists to delete.
- **DeviceID=0 on all records:** The listing returns `DeviceID: 0` for all machines. Get/Update by Device ID cannot be meaningfully tested until Nayax clarifies the expected DeviceID values for the sandbox.
- **Sandbox test MachineID:** `1002524581` (created earlier in testing).
