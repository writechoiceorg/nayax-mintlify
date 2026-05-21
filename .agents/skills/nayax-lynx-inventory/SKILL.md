---
name: nayax-lynx-inventory
description: >-
  Use this skill when a developer is working with Nayax Lynx API inventory management. Triggers include: setting up product catalog, creating product groups or categories, adding operator products, assigning products to vending machines, configuring machine product slots, building pick lists for restocking, troubleshooting 500 errors on pick list creation, asking about NayaxProductID vs ProductID, managing vending machine inventory, or following the inventory setup workflow. Keywords: product groups, operator products, machine products, pick lists, NayaxProductID, ActorID, inventory, restock, vending machine catalog, ProductGroupID.
---

Latest Lynx API version: **v1**.

## Workflow routing

| Trying to… | Endpoint | Reference |
| --- | --- | --- |
| Create a product group | `POST /v1/productGroups` | <references/product-groups.md> |
| List product groups | `GET /v1/productGroups` | <references/product-groups.md> |
| Get, update, or delete a product group | `GET/PUT/DELETE /v1/productGroups/{ProductGroupID}` | <references/product-groups.md> |
| Create an operator product | `POST /v1/operators/{ActorID}/products` | <references/products.md> |
| List operator products | `GET /v1/operators/{ActorID}/products` | <references/products.md> |
| Browse the Nayax global product catalog | `GET /v1/nayaxProducts` | <references/products.md> |
| Map a product to a machine | `POST /v1/machines/{MachineID}/products` | <references/machine-products.md> |
| List products assigned to a machine | `GET /v1/machines/{MachineID}/products` | <references/machine-products.md> |
| Update a machine product | `PUT /v1/machines/{MachineID}/products/{ProductID}` | <references/machine-products.md> |
| Create a pick list | `POST /v1/machines/{MachineID}/pickList` | <references/pick-lists.md> |
| Get current pick list | `GET /v1/machines/{MachineID}/pickList` | <references/pick-lists.md> |

## Critical rules

- **4-step order**: Product groups must exist before products. Products must exist before machine product mapping. Machine products must exist before pick list population. Do not skip or reorder steps.
- **Tax endpoints are permission-gated**: `GET/POST/PUT /v1/productGroups/{id}/tax` all return 403 with a standard operator token. Contact Nayax to enable tax permissions if needed.
- **ActorID for products**: Operator products are scoped to an ActorID. Always use your operator's ActorID — not a machine ID. Sandbox ActorID: `2009586082`.
- **NayaxProductID vs operator ProductID**: Nayax maintains a global product catalog. Your operator products reference catalog items via `NayaxProductID`. The resulting operator-specific product has its own separate `ProductID`. Do not conflate the two.
- **Pick list empty body**: `POST /v1/machines/{MachineID}/pickList` with an empty body `{}` returns 200 OK and creates a pick list with no items. This is expected behavior, not an error.
- **Pick list empty Products array crashes server**: Sending `{"Products": []}` (an explicit empty array) causes a 500. Either omit the `Products` key entirely or include at least one product object.

## Key documentation

- [Product groups](https://developerhub.nayax.com/manage-data-operations/lynx-api/inventory-management/product-groups) — Creating and managing product group containers
- [Operator products](https://developerhub.nayax.com/manage-data-operations/lynx-api/inventory-management/products) — Adding operator-scoped products from the Nayax catalog
- [Machine products](https://developerhub.nayax.com/manage-data-operations/lynx-api/inventory-management/machine-products) — Mapping operator products to specific machines
- [Pick lists](https://developerhub.nayax.com/manage-data-operations/lynx-api/inventory-management/pick-lists) — Creating and retrieving restock orders for machines
