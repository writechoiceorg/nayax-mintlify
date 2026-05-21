# Product Groups

## When to use

Product groups are category containers that must exist before you can create operator products. Every operator product requires a `ProductGroupID`, so this is always the first step in the inventory setup workflow. Use this reference when creating, listing, retrieving, or updating product groups, or when troubleshooting 403 errors on tax endpoints.

## How to do it

**Create a product group**

```http
POST /v1/productGroups
Content-Type: application/json

{
  "ProductGroupName": "Beverages",
  "ProductGroupCode": "BEV",
  "LanguageId": 1
}
```

A successful response returns the new `ProductGroupID`. Save this value — you will need it when creating operator products.

**List all product groups**

```http
GET /v1/productGroups
```

**Get a specific product group**

```http
GET /v1/productGroups/{ProductGroupID}
```

**Update a product group**

```http
PUT /v1/productGroups/{ProductGroupID}
Content-Type: application/json

{
  "ProductGroupName": "Cold Beverages",
  "ProductGroupCode": "CBEV",
  "LanguageId": 1
}
```

**Tax endpoints (permission-gated)**

The following endpoints exist in the API but require elevated permissions beyond the standard operator token:

```http
GET  /v1/productGroups/{ProductGroupID}/tax
POST /v1/productGroups/{ProductGroupID}/tax
PUT  /v1/productGroups/{ProductGroupID}/tax
```

All three return `403 Forbidden` with a standard operator token. Contact Nayax to have tax permissions enabled on your account before attempting these calls.

## Traps to avoid

- **No input validation on create**: Sending zero or empty values — `"ProductGroupName": ""` or `"ProductGroupCode": 0` — does not cause an error. The API creates the group anyway with those empty values. Always use meaningful names and codes to avoid polluting your catalog with blank entries.
- **No delete endpoint**: There is no `DELETE /v1/productGroups` endpoint in the Nayax API. Product groups cannot be deleted via API. Plan your group structure carefully before creation.
- **Tax 403 is not a bug**: If you hit 403 on any `/tax` sub-resource, this is a permissions issue, not a code error. Do not retry with different request bodies — contact Nayax support instead.
- **LanguageId is required**: Omitting `LanguageId` may result in unexpected behavior. Use `1` for English.
