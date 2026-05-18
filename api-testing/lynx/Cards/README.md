# Cards

Tests for card management — creating, retrieving, updating, and performing balance operations on prepaid and credit cards.

**Status:** 13 pass / 6 fail / 1 skip (20 requests total)

---

## Run Order

| # | Request | Notes |
|---|---------|-------|
| 1 | Create Virtual Card | Creates the test card used throughout. Note the returned CardUniqueIdentifier. |
| 2 | Get Cards | Must include at least one query parameter (e.g. CardUniqueIdentifier). No params = 400. |
| 3 | Get Card by Unique Identifier | Use the ID from step 1. |
| 4 | Get Card by Display Number | Use the display number returned in step 1. |
| 5 | Get Prepaid Card | — |
| 6 | Get Card Group | — |
| 7 | Get Card Revalue | Check revalue balance before adding. |
| 8 | Add to Card Revalue | Adds revalue balance to the card. |
| 9 | Get Credit from a Card | Check credit balance before adding. |
| 10 | Add Credit to a Card | Adds credit balance to the card. |
| 11 | Update Card Details | — |
| 12 | Update Card Status | — |
| 13 | Update Card Groups | — |
| 14 | Transfer Revalue Between Cards | Requires two cards. Use a second test card as the destination. |
| 15 | Validate Card for Machine | — |
| 16 | Create New Card v2 | v2/alternate endpoints — run after core flow is validated. |
| 16 | Update Card by ID v2 | — |
| 16 | Update Card Details by Display Number | — |
| 16 | Update Prepaid Card | — |
| 17 | Get Credit Card Latest Transactions | Run last. Body must be SHA1/base64 encoded — see Known Behaviors. |

---

## Known Behaviors

- **Get Cards — missing search fields (400):** At least one query parameter is required. Sending an empty request returns `400 "Search fields are missing"`.
- **Create New Card v2 — field names:** Earlier versions of this request used incorrect field names (`CardType`, `CardStatus`) and were missing required credit limit fields (`CreditAmountDailyLimit`, `CreditAmountMonthlyLimit`, `CreditAmountMonthlyReload`). These are fixed in the current collection.
- **Get Credit Card Latest Transactions — encoded body:** The request body must be a SHA1/base64 encoded string, not plain text. Plain text returns an error.
- **Update Prepaid Card — credit limit fields:** Required credit limit fields were missing in an earlier version. Fixed in the current collection.
- **Valid enum values:** `CardType: 33` (prepaid), `CardPhysicalType: 2`.
- **Sandbox test card IDs:** TEST-CARD-001 through TEST-CARD-006; CardIDs starting with `999998...`.
