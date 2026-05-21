# Dashboard Widgets

## When to use

Use the widget endpoints when building operator-level dashboards that aggregate data across multiple machines or an entire operator account. These endpoints return pre-shaped data for specific visualization types (totals, trends, breakdowns) rather than raw transaction records. There are two steps: first discover which widget types are available for the account, then request data for a specific widget type.

## How to do it

**Step 1 — Discover widget types**

Call `GET /v1/report/widgetsTypes` with no body. This returns the full list of widget types available for the authenticated account.

```
GET https://qa-lynx.nayax.com/v1/report/widgetsTypes
```

Example response shape:
```json
[
  {
    "widgetTypeId": 3,
    "widgetName": "Total Sales",
    ...
  },
  ...
]
```

Save the `widgetTypeId` values from this response. You must use one of these IDs in Step 2.

**Step 2 — Fetch widget data**

Call `POST /v1/report/widgetsData` with a JSON body. Use a `widgetTypeId` obtained from Step 1.

```
POST https://qa-lynx.nayax.com/v1/report/widgetsData
Content-Type: application/json
```

Request body:
```json
{
  "widgetTypeId": 3,
  "screenTypeId": 1,
  "actorId": "2009586082",
  "startDate": "2026-01-01",
  "endDate": "2026-05-21"
}
```

Available filter fields:
- `widgetTypeId` — required; integer from widgetsTypes discovery
- `screenTypeId` — required; integer, minimum value is `1` (see Traps)
- `actorId` — operator account ID; sandbox value is `"2009586082"`
- `machineId` — optional; restrict data to a single machine
- `startDate` — optional; ISO date string `"YYYY-MM-DD"`
- `endDate` — optional; ISO date string `"YYYY-MM-DD"`

The response is a widget-specific data array. The shape varies by widget type — a sales total widget returns different fields than a trend widget.

**Sandbox reference values:**
- Base URL: `https://qa-lynx.nayax.com`
- ActorID: `2009586082`

**Alternative dashboard endpoint**

There is a second widget data endpoint at `POST /v1/dashboard/get-widget-data`. It requires `screenTypeId` in the request body (value must be > 0). An empty body or `screenTypeId: 0` causes 500 with downstream error "screenTypeId can't be zero". Use the same `screenTypeId: 1` minimum as with `widgetsData`.

```
POST https://qa-lynx.nayax.com/v1/dashboard/get-widget-data
Content-Type: application/json

{
  "screenTypeId": 1
}
```

## Traps to avoid

- **`screenTypeId: 0` causes a 500 error.** Both `/v1/report/widgetsData` and `/v1/dashboard/get-widget-data` will return a 500 server error. Always use `screenTypeId: 1` or higher. This is not documented.
- **Empty body on get-widget-data causes 500.** The `/v1/dashboard/get-widget-data` endpoint requires a body with at least `{"screenTypeId": 1}`. Sending an empty body `{}` or omitting the body triggers a 500 with the message "screenTypeId can't be zero".
- **Do not hardcode `widgetTypeId`.** Widget type IDs are account-specific. Always call `GET /v1/report/widgetsTypes` first and read the IDs from the response. A hardcoded ID that works in one account will silently return no data or error in another.
- **Response shape varies by widget type.** Do not assume a fixed schema for the widgetsData response — inspect the actual response for the specific `widgetTypeId` you are using before writing any parsing logic.
- **Both endpoints require authentication.** Include the Lynx API bearer token on both requests; unauthenticated calls return 401.
