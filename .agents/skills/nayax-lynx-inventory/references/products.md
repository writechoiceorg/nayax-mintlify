# Operator Products

## When to use

Use this reference when creating or listing operator-scoped products. An operator product wraps a Nayax global catalog item with your operator-specific details such as price and product group assignment. This is step 2 of the inventory workflow — product groups must already exist before you create products, and products must exist before you can map them to machines.

Use the Nayax global catalog (`GET /v1/nayaxProducts`) to find valid `NayaxProductID` values when you do not already know them.

## How to do it

**Browse the Nayax global product catalog**

Use this to find `NayaxProductID` values before creating operator products.

```http
GET /v1/nayaxProducts
```

Sandbox test value: `NayaxProductID = 999998535696561`

**Create an operator product**

Replace `{ActorID}` with your operator's ActorID (not a machine ID). Sandbox ActorID: `2009586082`.

```http
POST /v1/operators/{ActorID}/products
Content-Type: application/json

{
  "NayaxProductID": 999998535696561,
  "ProductName": "Cola 330ml",
  "ProductGroupID": 12345,
  "Price": 1.50
}
```

A successful response returns the new operator `ProductID`. This is the ID you use for machine product mapping — it is different from `NayaxProductID`.

**List operator products**

```http
GET /v1/operators/{ActorID}/products
```

Returns all products created under the specified operator.

## Traps to avoid

- **NayaxProductID is not your ProductID**: `NayaxProductID` comes from the global Nayax catalog and identifies the base product. Your operator product gets its own `ProductID` which is what you use in subsequent steps (machine products, pick lists). Never use `NayaxProductID` where `ProductID` is expected.
- **ActorID is not a MachineID**: Products are scoped to an operator via `ActorID`. Passing a machine ID in the `{ActorID}` path segment will fail or return unexpected results.
- **ProductGroupID must already exist**: The `ProductGroupID` in the request body must reference a group created in step 1. If the group does not exist, the request will fail. Complete the product groups step first.
- **Price is operator-specific**: The `Price` field is your operator's selling price for this product, independent of any Nayax catalog pricing. Set it explicitly — do not assume it will be inherited.
- **Sandbox NayaxProductID**: When testing in the sandbox environment, use `999998535696561` as a known-good `NayaxProductID`. Not all catalog IDs are available in sandbox.
