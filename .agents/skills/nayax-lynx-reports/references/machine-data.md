# Machine Data

## When to use

Use these endpoints when building per-machine reporting dashboards or analytics views. They return data scoped to a single machine identified by its MachineID in the URL path. Use `lastSales` for recent transaction feeds, `statistics` for aggregated totals and averages, and `changeLogs` for configuration history. For cross-machine or operator-level reporting, use the widget endpoints in `widgets.md` instead.

All three endpoints are confirmed working in sandbox with MachineID `1002529791`.

## How to do it

**Get last sales for a machine**

Returns a list of recent transactions for the specified machine.

```
GET https://qa-lynx.nayax.com/v1/machines/{MachineID}/lastSales
```

Example:
```
GET https://qa-lynx.nayax.com/v1/machines/1002529791/lastSales
```

Optional query parameters:
- `startDate` — ISO date string `"YYYY-MM-DD"` to filter transactions from this date
- `endDate` — ISO date string `"YYYY-MM-DD"` to filter transactions up to this date

Response: array of transaction objects. Returns `[]` when no sales exist in the date range.

---

**Get machine statistics**

Returns aggregated sales statistics for the machine — totals, averages, and counts.

```
GET https://qa-lynx.nayax.com/v1/machines/{MachineID}/statistics
```

Example:
```
GET https://qa-lynx.nayax.com/v1/machines/1002529791/statistics
```

Optional query parameters:
- `startDate` — ISO date string
- `endDate` — ISO date string

Response: object with aggregated metrics. The exact fields reflect totals and averages computed over the date range.

---

**Get machine change log**

Returns a history of configuration changes made to the machine.

```
GET https://qa-lynx.nayax.com/v1/machines/{MachineID}/changeLogs
```

Example:
```
GET https://qa-lynx.nayax.com/v1/machines/1002529791/changeLogs
```

Response: array of change log entries. Returns `[]` when no changes exist for the machine.

---

**Sandbox reference values:**
- Base URL: `https://qa-lynx.nayax.com`
- MachineID: `1002529791`

## Traps to avoid

- **MachineID must be a real, valid machine ID.** All three endpoints require a real MachineID in the URL path. There is no default or fallback — passing an invalid or non-existent ID returns an error. Use `1002529791` for sandbox testing.
- **An empty array `[]` is not an error.** When a machine has no data in the requested date range, the API returns `[]` — treat this as a valid empty state, not a failure.
- **These endpoints are machine-scoped, not operator-scoped.** They return data for one machine only. If you need aggregated data across all machines for an operator, use `POST /v1/report/widgetsData` instead.
- **All endpoints require authentication.** Include the Lynx API bearer token in the request header; unauthenticated calls return 401.
