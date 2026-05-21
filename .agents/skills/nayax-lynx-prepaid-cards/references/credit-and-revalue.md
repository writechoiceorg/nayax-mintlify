# Credit and Revalue

## When to use

Use this reference when adding funds to a card, checking a card's balance, or working with revalue operations. Credit and revalue are two separate stores of value on a Lynx prepaid card. Credit is the standard spending balance used at machines. Revalue is a separate store-of-value used for machine refunds and cashback — it is only available on cards that were created with `CardCreditAttributes.RevalueCashBit: true`.

## How to do it

### Add credit to a card

`POST /v1/cards/{CardUniqueIdentifier}/credit/add`

Use the `CardUniqueIdentifier` string (not the numeric `CardID`) in the URL path.

```json
{
  "CreditAmount": 10.00
}
```

### Check credit balance

`GET /v1/cards/{CardUniqueIdentifier}/credit`

No request body. Returns the current credit balance for the card.

### Add revalue to a card

`POST /v1/cards/{CardUniqueIdentifier}/revalue/add`

The card must have been created with `CardCreditAttributes.RevalueCashBit: true`. If not, this call returns 400 "This Card is not defined as Revalue".

```json
{
  "RevalueAmount": 5.00
}
```

### Check revalue balance

`GET /v1/cards/{CardUniqueIdentifier}/revalue`

No request body. The card must have `RevalueCashBit: true` — same requirement as add revalue.

### Transfer revalue between cards

`POST /v1/cards/{CardUniqueIdentifier}/revalue/transfer`

Both the source card (in the URL path) and the destination card must have `RevalueCashBit: true`.

```json
{
  "TargetCardUniqueIdentifier": "TARGET-CARD-IDENTIFIER",
  "RevalueAmount": 5.00
}
```

### Credit vs revalue — which to use

| Scenario | Use |
| --- | --- |
| Adding spending funds to a card | Credit (`/credit/add`) |
| Machine refund or cashback | Revalue (`/revalue/add`) |
| Moving refund balance between cards | Revalue transfer (`/revalue/transfer`) |
| Checking what a card can spend | Credit (`/credit`) |

## Traps to avoid

- **Revalue on a card without RevalueCashBit**: If `CardCreditAttributes.RevalueCashBit` is `null` or `false` on the card, all revalue endpoints return 400 "This Card is not defined as Revalue". There is no fix — the card must be recreated with `RevalueCashBit: true`. Check the sandbox card `TEST-CARD-004` (CardID: 999998796245511) as an example of a card where revalue will always fail. Use `TEST-CARD-V2-RETEST-001` (CardID: 999998796299591) to test revalue operations.
- **Confusing credit and revalue**: Credit is the spending balance. Revalue is a separate machine-refund store. Adding credit does not add revalue and vice versa. Developers sometimes try to use revalue as a general top-up mechanism — redirect them to the credit endpoint instead.
- **Wrong identifier in URL**: All credit and revalue endpoints use `CardUniqueIdentifier` (the string you assigned at creation) in the path, not the numeric `CardID`. Verify which identifier type the URL requires.
- **Transfer requires both cards to have RevalueCashBit**: The transfer endpoint checks both the source and target card for `RevalueCashBit: true`. If either card was created without this flag, the transfer will fail.
- **No partial revalue flag enable**: There is no PATCH or partial update that enables `RevalueCashBit` on an existing card. The only path forward for a card missing this flag is card recreation.
