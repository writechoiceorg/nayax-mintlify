---
name: nayax-lynx-reports
description: >-
  Use this skill when a developer is building transactional reports, dashboard widgets, or machine-level analytics using the Nayax Lynx API. Trigger keywords include: dashboard widgets, widget data, widget types, machine sales, last sales, machine statistics, machine change log, per-machine reporting, operator-level reporting, sales analytics, vending machine data, Lynx reports, widgetsTypes, widgetsData, changeLogs, actorId, screenTypeId. This skill covers the two reporting surfaces in Lynx — the operator-level dashboard widget endpoints and the per-machine data endpoints — including the undocumented constraints that cause silent failures in sandbox.
---

Latest Lynx API version: **v1**.

## Workflow routing

| Trying to… | Endpoint | Reference |
| --- | --- | --- |
| Discover available dashboard widget types | `GET /v1/report/widgetsTypes` | <references/widgets.md> |
| Get dashboard widget data | `POST /v1/report/widgetsData` | <references/widgets.md> |
| Get last sales for a machine | `GET /v1/machines/{MachineID}/lastSales` | <references/machine-data.md> |
| Get machine statistics | `GET /v1/machines/{MachineID}/statistics` | <references/machine-data.md> |
| Get machine change log | `GET /v1/machines/{MachineID}/changeLogs` | <references/machine-data.md> |

## Critical rules

- **Discover widget types first**: Always call `GET /v1/report/widgetsTypes` before calling `POST /v1/report/widgetsData`. The `widgetTypeId` used in the request body must come from this discovery call — it cannot be guessed or hardcoded.
- **screenTypeId must be ≥ 1**: Passing `screenTypeId: 0` causes a 500 server error. The minimum valid value is `1`. This constraint is not documented in the official API reference.
- **MachineID is required for machine data endpoints**: All three machine-level endpoints (`lastSales`, `statistics`, `changeLogs`) require a real MachineID in the path. Sandbox MachineID: `1002529791`.
- **Widget endpoints are confirmed working in sandbox**: `GET /v1/report/widgetsTypes` and `POST /v1/report/widgetsData` both pass in sandbox (2/2 confirmed). Use ActorID `2009586082` for sandbox requests.
- **Empty arrays are valid responses**: Machine data endpoints return `[]` when no data exists in the requested date range — this is not an error.

## Key documentation

- [Dashboard Widgets](https://developerhub.nayax.com/manage-data-operations/lynx-api/reports/dashboard-widgets) — Use when building operator-level dashboard widgets or fetching widget type metadata
- [Machine Statistics](https://developerhub.nayax.com/manage-data-operations/lynx-api/machines/machine-statistics) — Use when building per-machine reporting dashboards or accessing machine-level sales aggregates
