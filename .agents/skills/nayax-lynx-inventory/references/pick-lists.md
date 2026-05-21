# Pick Lists

## When to use

Use this reference when creating or retrieving a pick list for a vending machine. A pick list is a restock order — it records which products need to be refilled and in what quantities for a specific machine. This is step 4 of the inventory workflow and requires that machine products are already configured on the target machine.

## How to do it

**Create an empty pick list**

Sending an empty body creates a pick list with no items. This returns 200 OK and is expected behavior.

```http
POST /v1/machines/{MachineID}/pickList
Content-Type: application/json

{}
```

**Create a pick list with products**

To specify restock quantities, include a `Products` array with at least one product object.

```http
POST /v1/machines/{MachineID}/pickList
Content-Type: application/json

{
  "Products": [
    {
      "ProductID": 67890,
      "Quantity": 10
    },
    {
      "ProductID": 67891,
      "Quantity": 5
    }
  ]
}
```

`ProductID` here is the operator `ProductID`, not `NayaxProductID`.

**Get the current pick list**

```http
GET /v1/machines/{MachineID}/pickList
```

Returns the current pick list for the machine. Use this to verify a pick list was created correctly, since the POST response body is empty.

## Traps to avoid

- **Never send an empty Products array**: `{"Products": []}` causes a 500 Internal Server Error. This is a known server-side bug. If you want an empty pick list, omit the `Products` key entirely and send `{}` instead.
- **curl requires `Content-Length: 0` for empty body**: Some HTTP clients (including curl) omit the `Content-Length` header when the body is empty, causing the server to return 411 Length Required. Add `-H "Content-Length: 0"` when calling this endpoint with an empty body via curl or any client that omits this header by default.
- **POST response body is empty**: A successful `POST /v1/machines/{MachineID}/pickList` returns 200 OK with no body content. This does not mean the request failed. Use `GET /v1/machines/{MachineID}/pickList` to confirm the pick list was created and inspect its contents.
- **Products must be mapped to the machine first**: You can only include products in a pick list that are already assigned to the machine via the machine products step. Referencing a `ProductID` not configured on the machine may cause errors.
- **ProductID is not NayaxProductID**: The `ProductID` in the `Products` array is your operator-specific product ID, not the Nayax catalog ID.
- **One active pick list per machine**: The API manages a single current pick list per machine. Posting a new pick list replaces or updates the existing one — confirm behavior with `GET` after each POST.
