---
name: nayax-lynx-prepaid-cards
description: >-
  Use this skill when a developer is integrating Nayax Lynx prepaid card functionality, including creating virtual or prepaid cards, adding credit or revalue to cards, checking card balances, searching for cards, retrieving card details, viewing transaction history, or transferring revalue between cards. Triggers on keywords like: prepaid card, virtual card, card credit, revalue, CardTypeID, CardUniqueIdentifier, card balance, card transaction history, Lynx cards API, create card, top up card, card status.
---

Latest Lynx API version: **v1/v2** (v2 card endpoints available for card creation and updates).

## Workflow routing

| Trying to… | Endpoint | Reference |
| --- | --- | --- |
| Create a virtual card (simpler, fewer fields) | `POST /v1/cards` | <references/create-cards.md> |
| Create a full-featured prepaid card | `POST /v2/cards` | <references/create-cards.md> |
| Update card status or details | `PUT /v1/cards/{CardID}/status` or `PUT /v2/cards/{CardID}` | <references/create-cards.md> |
| Add credit to a card | `POST /v1/cards/{CardUniqueIdentifier}/credit/add` | <references/credit-and-revalue.md> |
| Check card credit balance | `GET /v1/cards/{CardUniqueIdentifier}/credit` | <references/credit-and-revalue.md> |
| Add revalue to a card | `POST /v1/cards/{CardUniqueIdentifier}/revalue/add` | <references/credit-and-revalue.md> |
| Check card revalue balance | `GET /v1/cards/{CardUniqueIdentifier}/revalue` | <references/credit-and-revalue.md> |
| Transfer revalue between cards | `POST /v1/cards/{CardUniqueIdentifier}/revalue/transfer` | <references/credit-and-revalue.md> |
| Search for cards with filters | `GET /v1/cards` | <references/search-and-retrieve.md> |
| Get a single card by unique identifier | `GET /v1/cards/{CardUniqueIdentifier}` | <references/search-and-retrieve.md> |
| Get card transaction history | `POST /v1/cards/query` | <references/search-and-retrieve.md> |

## Critical rules

- **CardTypeID must be 33**: For prepaid cards, always set `CardTypeID: 33`. Valid values are 31=Technician, 33=Prepaid, 34=Refund, 30000616=Discount. Using 1 or any other value will fail.
- **CardPhysicalType is required but undocumented**: Always include `CardPhysicalType: 2` in v1 card creation requests. The spec does not mark it as required, but omitting it causes a 400 error. For v2, the field name is `PhysicalTypeID` and the value is `30000528`.
- **CountryID for card creation is 225, not 840**: Card creation endpoints use Nayax internal CountryID format. `225` = United States. Using the ISO numeric format (`840`) causes 500 `country_id_not_valid`. Actor endpoints use `840`; card endpoints use `225`.
- **CardDateRules is required for v2 but undocumented**: `POST /v2/cards` requires a `CardDateRules` object with at least `ActivationDate` and `ExpirationDate`. The error message "CardDetails cant be null" is misleading — the actual `errorKey` is `null_CardDateRules`. Without this block the request will fail with a confusing 400.
- **RevalueCashBit must be set at creation**: If you want to use any revalue endpoints, you must set `CardCreditAttributes.RevalueCashBit: true` when creating the card. This cannot be changed after creation.
- **GET /v1/cards requires at least one filter**: All query parameters are marked optional in the spec, but sending a request with no parameters (or all empty) causes a 400 "Search fields are missing" error.
- **v2 CardCreditAttributes fields are required but undocumented**: When using `POST /v2/cards`, the `CardCreditAttributes` block must include `CreditAmountDailyLimit`, `CreditAmountMonthlyLimit`, and `CreditAmountMonthlyReload`. These are required but not documented as such.
- **GET /v1/cards response is nested**: The response shape uses sub-objects — access fields via `CardDetails`, `CardHolderDetails`, and `CardCreditAttributes` keys, not as a flat object.
- **Transaction history body is a JSON string, not an object**: `POST /v1/cards/query` requires the card number as a SHA1 hash encoded as base64, sent as a bare JSON string. Sending `{}` or a plain object causes a 500 error.

## Key documentation

- [Create prepaid cards](https://developerhub.nayax.com/manage-data-operations/lynx-api/cards/create-cards) — Card creation for v1 and v2, required fields, CardCreditAttributes
- [Card management](https://developerhub.nayax.com/manage-data-operations/lynx-api/cards/card-management) — Status updates, card types, updating card details
- [Balance and transactions](https://developerhub.nayax.com/manage-data-operations/lynx-api/cards/balance-tracking) — Credit and revalue operations, transaction history query
