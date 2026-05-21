# Create Cards

## When to use

Use this reference when creating a new prepaid or virtual card via the Lynx API, or when updating an existing card's status or details. There are two creation endpoints: `POST /v1/cards` for simpler virtual cards and `POST /v2/cards` for full-featured prepaid cards with credit limit configuration. Use the v2 endpoint when you need to configure daily/monthly credit limits or reload amounts at creation time.

## How to do it

### Create a virtual card (v1)

`POST /v1/cards`

Minimum required fields:

```json
{
  "CardTypeID": 33,
  "CardPhysicalType": 2,
  "CardUniqueIdentifier": "YOUR-UNIQUE-STRING-HERE",
  "Status": 1
}
```

Optional but recommended — include `CardCreditAttributes` with `RevalueCashBit: true` if you want to use revalue endpoints later:

```json
{
  "CardTypeID": 33,
  "CardPhysicalType": 2,
  "CardUniqueIdentifier": "YOUR-UNIQUE-STRING-HERE",
  "Status": 1,
  "CardCreditAttributes": {
    "RevalueCashBit": true
  }
}
```

### Create a prepaid card (v2)

`POST /v2/cards`

The v2 endpoint requires a `CardCreditAttributes` block with three limit fields that are not documented as required but will cause failures if omitted:

```json
{
  "CardTypeID": 33,
  "CardPhysicalType": 2,
  "CardUniqueIdentifier": "YOUR-UNIQUE-STRING-HERE",
  "Status": 1,
  "CardCreditAttributes": {
    "CreditAmountDailyLimit": 100.00,
    "CreditAmountMonthlyLimit": 500.00,
    "CreditAmountMonthlyReload": 500.00,
    "RevalueCashBit": true
  }
}
```

Set `RevalueCashBit: true` here if the card will ever need revalue operations. There is no way to enable this flag after card creation.

### Update card status

`PUT /v1/cards/{CardID}/status`

Update the numeric `CardID` (not the `CardUniqueIdentifier`).

```json
{
  "Status": 2
}
```

### Update card details (v2)

`PUT /v2/cards/{CardID}`

Use the numeric `CardID`. Supports updating `CardCreditAttributes` limits and other details, but `RevalueCashBit` cannot be changed after creation.

### Sandbox test cards

| CardUniqueIdentifier | CardID | RevalueCashBit | Notes |
| --- | --- | --- | --- |
| `TEST-CARD-V2-RETEST-001` | `999998796299591` | `true` | Works with all endpoints including revalue |
| `TEST-CARD-004` | `999998796245511` | `null` | Cannot use revalue endpoints |

## Traps to avoid

- **Wrong CardTypeID**: `CardTypeID` must be `33` for prepaid cards. Using `1`, `31`, or any other value will result in the wrong card type or an error. Valid values: 31=Technician, 33=Prepaid, 34=Refund, 30000616=Discount.
- **Missing CardPhysicalType**: The spec does not mark `CardPhysicalType` as required, but omitting it causes a `400` error. Always include `"CardPhysicalType": 2`.
- **Missing v2 credit limit fields**: `POST /v2/cards` silently requires `CreditAmountDailyLimit`, `CreditAmountMonthlyLimit`, and `CreditAmountMonthlyReload` inside `CardCreditAttributes`. These are not flagged as required in the documentation but the request will fail without them.
- **Forgetting RevalueCashBit**: If a developer asks why revalue endpoints return 400 "This Card is not defined as Revalue", the card was created without `RevalueCashBit: true`. The only fix is to create a new card — this flag cannot be updated after creation.
- **Using CardUniqueIdentifier in PUT requests**: Status and detail update endpoints use the numeric `CardID`, not the `CardUniqueIdentifier` string. Check which identifier the endpoint expects before constructing the URL.
