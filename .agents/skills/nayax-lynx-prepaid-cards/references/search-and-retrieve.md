# Search and Retrieve

## When to use

Use this reference when looking up cards by identifier, searching for cards using filters, retrieving a card's full details, or querying a card's transaction history. There are four distinct retrieval patterns: filtered search, lookup by unique identifier string, lookup by display number, and transaction history query. Each uses a different endpoint and different identifier type.

## How to do it

### Search for cards with filters

`GET /v1/cards`

At least one query parameter must be non-empty. All parameters are marked optional in the spec, but sending no parameters (or all empty strings) returns 400 "Search fields are missing".

Common parameters:

| Parameter | Description |
| --- | --- |
| `CardUniqueIdentifier` | The string identifier assigned at card creation |
| `CardStatus` | Filter by status value (e.g. `1` for active) |
| `CardType` | Filter by CardTypeID (e.g. `33` for prepaid) |
| `DisplayNumber` | Nayax-assigned display number |

Example request:

```
GET /v1/cards?CardType=33&CardStatus=1
```

Response shape is nested — not flat. Access card details via sub-objects:

```json
{
  "CardDetails": {
    "CardID": 999998796299591,
    "CardUniqueIdentifier": "TEST-CARD-V2-RETEST-001",
    "Status": 1
  },
  "CardHolderDetails": {
    "FirstName": "...",
    "LastName": "..."
  },
  "CardCreditAttributes": {
    "CreditBalance": 25.00,
    "RevalueCashBit": true,
    "CreditAmountDailyLimit": 100.00
  }
}
```

Do not expect top-level fields like `response.CreditBalance` — always traverse into the relevant sub-object.

### Get a single card by unique identifier

`GET /v1/cards/{CardUniqueIdentifier}`

Use the string identifier you assigned at card creation. Returns the same nested response shape as the search endpoint.

```
GET /v1/cards/TEST-CARD-V2-RETEST-001
```

### Get a card by display number

`GET /v1/cards/displayNumber/{DisplayNumber}`

Use the Nayax-assigned display number (different from `CardUniqueIdentifier`). Useful when you have the printed card number but not the internal identifier.

### Get a card by numeric CardID

`GET /v1/cards/{CardID}`

Use the numeric `CardID` (e.g. `999998796299591`). The endpoint path is the same format as `CardUniqueIdentifier` — Lynx resolves which type is intended based on whether the value is numeric.

### Get transaction history

`POST /v1/cards/query`

This endpoint does not accept a standard JSON body. The request body must be a bare JSON string containing the base64-encoded SHA1 hash of the card number. Sending an empty object `{}` or a plain JSON body causes a 500 error.

Steps to construct the body:

1. Take the card number (the `DisplayNumber` or card identifier used for transactions).
2. Compute the SHA1 hash of the card number.
3. Base64-encode the SHA1 hash bytes.
4. Send that base64 string as the entire request body — a JSON string, not an object.

Example request body (the value will be a base64 string):

```
"dGhpcyBpcyBhbiBleGFtcGxlIGhhc2g="
```

The `Content-Type` header should still be `application/json`. The body is a JSON-encoded string value, not a JSON object.

## Traps to avoid

- **Sending GET /v1/cards with no parameters**: Even though the spec marks all query params as optional, the API requires at least one non-empty filter. Always include at least one parameter such as `CardType=33` or a specific `CardUniqueIdentifier`.
- **Accessing flat fields on the search response**: The `GET /v1/cards` response nests card data under `CardDetails`, `CardHolderDetails`, and `CardCreditAttributes`. Code that tries to access `response.CardID` or `response.CreditBalance` directly will fail — use `response.CardDetails.CardID` and `response.CardCreditAttributes.CreditBalance`.
- **Wrong body format for POST /v1/cards/query**: The transaction history endpoint expects a JSON string as the body, not a JSON object. Sending `{}`, `{"cardNumber": "..."}`, or any object will return a 500. The body must be a quoted base64 string representing the SHA1 hash of the card number.
- **Mixing up identifier types**: There are three identifiers for a card — `CardUniqueIdentifier` (your string), `DisplayNumber` (Nayax-assigned), and `CardID` (numeric). Different endpoints expect different identifier types. Confirm which the endpoint path uses before making the call.
- **Assuming CardUniqueIdentifier and DisplayNumber are the same**: They are not. `CardUniqueIdentifier` is set by you at creation. `DisplayNumber` is assigned by Nayax and returned in the creation response. Retrieve the `DisplayNumber` from the created card response if you need it for display or transaction queries.
