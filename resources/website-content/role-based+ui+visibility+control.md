<!-- source: resources/files/Role-Based+UI+Visibility+Control.txt processed: 2026-05-06 -->

# Role-Based UI Visibility Control

## Overview

The App Framework implements a role-based UI visibility control system that allows the backend to dynamically hide or show UI elements based on user permissions. This provides fine-grained control over what users can see and interact with based on their roles.

## Architecture

The permission system consists of three main components:

| Component | Purpose |
|---|---|
| UIVisibilityProvider | Runtime provider that manages UI element visibility state |
| useUIVisibility Hook | React hook for components to check element visibility |
| UI_ELEMENTS Constants | Centralized registry of all controllable UI elements |

## How It Works

### 1. Provider Setup

At application startup, the `UIVisibilityProvider` wraps the entire app and fetches permission data.

Integration in `main.tsx`:

```typescript
import { UIVisibilityProvider } from './hooks'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <TranslationProvider>
        <UIVisibilityProvider>
          <App />
        </UIVisibilityProvider>
      </TranslationProvider>
    </ErrorBoundary>
  </StrictMode>
)
```

Provider implementation (`useUIVisibility.tsx`):

```typescript
export function UIVisibilityProvider({ children, model = 'App/Machines' }) {
  const [hiddenElements, setHiddenElements] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetches from: /core/apps/ui-elements?model=App/Machines
    // Returns: { hide: ['action.x', 'tab.y', ...] }
    const response = await getHiddenUIElements(model);
    setHiddenElements(new Set(response.hide));
    setIsLoading(false);
  }, []);
}
```

### 2. Backend Permission API

**Endpoint:** `GET /core/apps/ui-elements?model=App/Machines`

**Request details:**

- Includes credentials (session cookies/JWT tokens)
- Supports both absolute and relative URLs (dev/prod)

**Response format:**

```json
{
  "hide": [
    "action.restartDevice",
    "action.rebootDevice",
    "tab.settings",
    "widget.communication"
  ]
}
```

**Error handling:**

- Network failures: returns empty array (shows all elements)
- HTTP errors: returns empty array (fail-open for better UX)
- No exceptions thrown — graceful degradation

### 3. Using Permissions in Components

Import and use the visibility hook:

```typescript
import { useUIVisibility } from '../../hooks'
import { UI_ELEMENTS } from '../../constants/uiElements'

function MyComponent() {
  const { isVisible, isHidden, isLoading } = useUIVisibility()

  if (isVisible(UI_ELEMENTS.tabs.overview)) {
    return <OverviewTab />
  }

  return null
}
```

**Hook API:**

| Method | Description |
|---|---|
| `isVisible(elementId: string)` | Returns `true` if element should be shown |
| `isHidden(elementId: string)` | Returns `true` if element should be hidden |
| `isLoading: boolean` | Indicates if permissions are being fetched |
| `refresh()` | Manually re-fetch permissions from backend |

## UI Elements Registry

All controllable UI elements are defined in a centralized constants file (`src/constants/uiElements.ts`):

```typescript
export const UI_ELEMENTS = {
  // Machine Dashboard Tabs
  tabs: {
    overview: 'tab.overview',
    products: 'tab.products',
    lastSales: 'tab.lastSales',
    lastAlerts: 'tab.lastAlerts',
    schedule: 'tab.schedule',
    settings: 'tab.settings',
    logs: 'tab.logs',
  },

  // Settings Sections
  settings: {
    general: 'settings.general',
    technicians: 'settings.technicians',
    businessDays: 'settings.businessDays',
    autoPrepaid: 'settings.autoPrepaid',
    alertThresholds: 'settings.alertThresholds',
    pulse: 'settings.pulse',
    dex: 'settings.dex',
  },

  // Dashboard Widgets
  widgets: {
    communication: 'widget.communication',
    stock: 'widget.stock',
    todaySales: 'widget.todaySales',
    lastTransaction: 'widget.lastTransaction',
    tubeStatus: 'widget.tubeStatus',
    deviceVersion: 'widget.deviceVersion',
    lastDex: 'widget.lastDex',
    lastVmcError: 'widget.lastVmcError',
    lastVisit: 'widget.lastVisit',
    machineRating: 'widget.machineRating',
    activeAlerts: 'widget.activeAlerts',
    machineInfo: 'widget.machineInfo',
  },

  // Machine Actions
  actions: {
    restartDevice: 'action.restartDevice',
    rebootDevice: 'action.rebootDevice',
    requestGtrace: 'action.requestGtrace',
    dumpParameters: 'action.dumpParameters',
    loadDefaults: 'action.loadDefaults',
    resetDefaultParameters: 'action.resetDefaultParameters',
    reloadConfiguration: 'action.reloadConfiguration',
    generatePicklist: 'action.generatePicklist',
    fullMachine: 'action.fullMachine',
    emptyMachine: 'action.emptyMachine',
  },

  // Sidebar & Top Menu
  sidebar: {
    search: 'sidebar.search',
    filters: 'sidebar.filters',
  },

  topMenu: {
    routeOverview: 'topMenu.routeOverview',
    userMenu: 'topMenu.userMenu',
  },
} as const
```

**Naming convention:**

- Format: `{category}.{name}`
- Categories: `tab`, `widget`, `action`, `settings`, `sidebar`, `topMenu`
- Names: camelCase (e.g., `overview`, `restartDevice`, `lastSales`)

## Permission Flow

```
App starts
     ↓
UIVisibilityProvider mounts
     ↓
Fetch GET /core/apps/ui-elements?model=App/Machines
     ↓
Backend validates JWT token
     ↓
Backend checks user role/permissions
     ↓
Backend returns { hide: ['element.ids'] }
     ↓
Frontend stores in Set<string>
     ↓
Components use useUIVisibility() hook
     ↓
Conditional rendering based on isVisible()
```

## Backend Integration

The backend implements the `/core/apps/ui-elements` endpoint to return role-based permissions.

Example backend implementation (C#):

```csharp
[HttpGet("core/apps/ui-elements")]
public async Task<IActionResult> GetHiddenUIElements([FromQuery] string model = "App/Machines")
{
    var user = _userContextAccessor.GetCurrentUser();
    var hiddenElements = new List<string>();

    switch (user.Role)
    {
        case "Administrator":
            // Admins see everything - return empty array
            break;

        case "Technician":
            // Hide sensitive actions
            hiddenElements.AddRange(new[]
            {
                "action.resetDefaultParameters",
                "action.dumpParameters",
                "settings.general"
            });
            break;

        case "Operator":
            // Limited access - hide most actions and settings
            hiddenElements.AddRange(new[]
            {
                "action.restartDevice",
                "action.rebootDevice",
                "action.requestGtrace",
                "action.dumpParameters",
                "tab.settings",
                "tab.logs"
            });
            break;

        case "Viewer":
            // Read-only - hide all actions
            hiddenElements.AddRange(new[]
            {
                "action.restartDevice",
                "action.rebootDevice",
                "action.requestGtrace",
                "action.dumpParameters",
                "action.loadDefaults",
                "action.resetDefaultParameters",
                "action.reloadConfiguration",
                "action.generatePicklist",
                "action.fullMachine",
                "action.emptyMachine",
                "tab.settings"
            });
            break;
    }

    return Ok(new { hide = hiddenElements });
}
```

## Build-Time UI Elements Extraction

During build, the system extracts all UI element IDs for backend reference.

**Process:**

1. `scripts/vite-plugin-extract-ui-elements.ts` reads `src/constants/uiElements.ts`
2. Extracts all element IDs using regex
3. Generates `ui-elements.json` in build output
4. Backend/ops teams can reference this file to know available element IDs

**Generated output (`ui-elements.json`):**

```json
[
  "action.dumpParameters",
  "action.emptyMachine",
  "action.fullMachine",
  "action.generatePicklist",
  "action.loadDefaults",
  "action.rebootDevice",
  "action.reloadConfiguration",
  "action.requestGtrace",
  "action.resetDefaultParameters",
  "action.restartDevice",
  "settings.alertThresholds",
  "settings.autoPrepaid",
  "settings.businessDays",
  "settings.dex",
  "settings.general",
  "settings.pulse",
  "settings.technicians",
  "sidebar.filters",
  "sidebar.search",
  "tab.lastAlerts",
  "tab.lastSales",
  "tab.logs",
  "tab.overview",
  "tab.products",
  "tab.schedule",
  "tab.settings",
  "widget.activeAlerts",
  "widget.communication",
  "widget.deviceVersion",
  "widget.lastDex",
  "widget.lastTransaction",
  "widget.lastVisit",
  "widget.lastVmcError",
  "widget.machineInfo",
  "widget.machineRating",
  "widget.stock",
  "widget.todaySales",
  "widget.tubeStatus"
]
```

## Common Use Cases

### Hiding Tabs Based on Role

```typescript
const { isVisible } = useUIVisibility()

const visibleTabs = useMemo(() =>
  TABS.filter(tab => isVisible(UI_ELEMENTS.tabs[tab.id as keyof typeof UI_ELEMENTS.tabs])),
  [isVisible]
)
```

### Hiding Actions in Dropdown

```typescript
const visibleActions = useMemo(() =>
  machineActions.filter(action =>
    isVisible(UI_ELEMENTS.actions[action.id as keyof typeof UI_ELEMENTS.actions])
  ),
  [isVisible, machineActions]
)
```

### Hiding Widgets in Dashboard

```typescript
{isVisible(UI_ELEMENTS.widgets.communication) && (
  <CommunicationWidget data={communicationData} />
)}

{isVisible(UI_ELEMENTS.widgets.stock) && (
  <StockWidget data={stockData} />
)}
```

### Conditional Settings Sections

```typescript
const settingsSections = [
  { id: 'general', component: <GeneralSettings /> },
  { id: 'technicians', component: <TechniciansSettings /> },
  { id: 'businessDays', component: <BusinessDaysSettings /> },
]

return (
  <>
    {settingsSections.map(section =>
      isVisible(UI_ELEMENTS.settings[section.id]) && (
        <div key={section.id}>{section.component}</div>
      )
    )}
  </>
)
```

## Best Practices

**1. Always use `UI_ELEMENTS` constants — never hardcode IDs:**

```typescript
// Good — type-safe and maintainable
isVisible(UI_ELEMENTS.tabs.overview)

// Avoid — prone to typos
isVisible('tab.overview')
```

**2. Filter lists with `useMemo` for performance:**

```typescript
const visibleTabs = useMemo(
  () => TABS.filter(tab => isVisible(UI_ELEMENTS.tabs[tab.id])),
  [isVisible]
)
```

**3. Handle loading state when needed:**

```typescript
const { isVisible, isLoading } = useUIVisibility()

if (isLoading) {
  return <LoadingSpinner />
}
```

**4. Use `filterVisible` helper for common patterns:**

```typescript
import { filterVisible } from '../../utils'

const visibleTabs = filterVisible(
  TABS,
  tab => UI_ELEMENTS.tabs[tab.id],
  isVisible
)
```

**5. Refresh permissions after role changes:**

```typescript
const { refresh } = useUIVisibility()

const handleRoleUpdate = async () => {
  await updateUserRole()
  refresh()  // Re-fetch permissions
}
```

## Adding New Controllable Elements

**1. Add element ID to constants:**

```typescript
// src/constants/uiElements.ts
export const UI_ELEMENTS = {
  tabs: {
    // ... existing tabs
    newTab: 'tab.newTab',  // Add here
  }
}
```

**2. Use in component:**

```typescript
import { useUIVisibility } from '../../hooks'
import { UI_ELEMENTS } from '../../constants/uiElements'

function MyComponent() {
  const { isVisible } = useUIVisibility()

  return (
    <>
      {isVisible(UI_ELEMENTS.tabs.newTab) && <NewTab />}
    </>
  )
}
```

**3. Build and deploy:**

```bash
npm run build  # Generates updated ui-elements.json
```

**4. Backend configuration:**

- Reference the generated `ui-elements.json`
- Add `tab.newTab` to the hidden list for specific roles

## Files Overview

| File | Purpose |
|---|---|
| `src/hooks/useUIVisibility.tsx` | React context for UI visibility provider and hook |
| `src/api/uiElementsApi.ts` | API client for fetching hidden elements |
| `src/constants/uiElements.ts` | Registry of all controllable UI elements |
| `scripts/vite-plugin-extract-ui-elements.ts` | Vite plugin to extract UI element IDs during build |
| `src/main.tsx` | App initialization with UIVisibilityProvider |

## Performance Considerations

| Aspect | Implementation |
|---|---|
| Efficient Lookups | Uses `Set<string>` for O(1) element visibility checks |
| Memoization | Filter operations wrapped in `useMemo()` to prevent unnecessary re-filtering |
| Single Fetch | Permissions fetched once on app startup, cached in context |
| Graceful Degradation | Network failures don't break the app; falls back to showing all elements |

## Troubleshooting

| Issue | Solution |
|---|---|
| Permissions not loading | Check browser console for failed fetch to `/core/apps/ui-elements?model=App/Machines`. Verify backend endpoint is implemented and accessible. Check JWT token/authentication headers. |
| Element not being hidden | Verify element ID is in the backend's `hide` array response. Check that component is using `isVisible()` to conditionally render. Confirm element ID matches exactly (case-sensitive). |
| Element ID not in ui-elements.json | Ensure element ID is defined in `src/constants/uiElements.ts`. Follow naming convention: `{category}.{name}` format. Run `npm run build` to regenerate. |
| All elements visible despite permissions | Check if API endpoint returns empty array (fail-open behavior). Verify backend permission logic is correct. Check browser DevTools Network tab for API response. |
