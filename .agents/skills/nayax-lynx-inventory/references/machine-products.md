# Machine Products

## When to use

Use this reference when assigning operator products to a specific vending machine, listing which products are configured on a machine, or updating machine-level product details such as price or slot number. This is step 3 of the inventory workflow — operator products must already exist before you can map them to machines.

Sandbox reference values: MachineID `1002529791`, operator ProductID from the products step.

## How to do it

**Map a product to a machine**

```http
POST /v1/machines/{MachineID}/products
Content-Type: application/json

{
  "ProductID": 67890,
  "MachineID": 1002529791
}
```

Use the operator `ProductID` (returned when you created the operator product), not the `NayaxProductID`. A successful response confirms the product has been assigned to the machine.

**List all products on a machine**

```http
GET /v1/machines/{MachineID}/products
```

Returns all products currently mapped to the specified machine, including their slot assignments and prices.

**Update a machine product**

Use this to change the price, slot number, or other machine-level product configuration after initial assignment.

```http
PUT /v1/machines/{MachineID}/products/{ProductID}
Content-Type: application/json

{
  "Price": 1.75,
  "SlotNumber": 3
}
```

`{ProductID}` in the path is the operator `ProductID`, not `NayaxProductID`.

## Traps to avoid

- **Use operator ProductID, not NayaxProductID**: The `{ProductID}` path parameter and the `ProductID` body field both expect your operator-specific product ID returned from `POST /v1/operators/{ActorID}/products`. Using the `NayaxProductID` here will result in errors or incorrect mappings.
- **Products must exist before mapping**: Attempting to map a product that has not been created as an operator product will fail. Complete step 2 (operator products) before running any machine product calls.
- **MachineID in body must match path**: When sending `MachineID` in the request body, ensure it matches the `{MachineID}` in the URL path to avoid inconsistencies.
- **No permission issues in sandbox**: All 5 machine products endpoints pass cleanly in the sandbox environment with a standard operator token. If you encounter 403 errors, verify your token and ActorID rather than assuming a permissions restriction on machine products specifically.
- **GET before PUT**: Always retrieve the current machine product state with `GET /v1/machines/{MachineID}/products` before sending an update. Sending a partial PUT without knowing the current values may overwrite fields unintentionally depending on API behavior.
