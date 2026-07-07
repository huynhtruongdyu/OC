# OC React — Codebase Overview

## Project Structure

```
src/
├── App.tsx                    # Root component — renders RouterProvider
├── index.tsx                  # Entry point — mounts App inside Providers
├── globals.css                # Tailwind import + Ant Design overrides
├── env.d.ts                   # TypeScript env declarations
│
├── api/                       # HTTP client & interceptors
│   ├── index.ts               # Axios instance creation
│   └── interceptors/
│       ├── index.ts           # Registers all interceptors
│       ├── requestTimer.ts    # Records startTime on requests
│       ├── requestLogger.ts   # Logs outgoing requests
│       ├── responseLogger.ts  # Logs response timing (non-prod)
│       ├── responseErrorToast.ts  # Toast on errors
│       └── types.ts           # ConfigWithMeta type
│
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx     # App shell: Sider + Header + Content + Outlet
│   │   ├── AuthLayout.tsx     # Centered blank layout for auth pages
│   │   └── index.ts
│   ├── weather/
│   │   ├── WeatherTable.tsx   # Reusable forecast table with temp colors
│   │   └── index.ts
│   └── ui/                    # Placeholder for shared UI primitives
│
├── config/
│   └── index.ts               # App config from env vars
│
├── features/                  # Feature modules (domain-focused)
│   └── weather/
│       ├── types.ts           # WeatherForecast type
│       ├── api.ts             # API call functions
│       ├── hooks.ts           # React Query hooks + query keys
│       └── index.ts
│
├── lib/                       # Pure utilities
│   ├── logger.ts              # Console logger (noop when debug off)
│   ├── toast.ts               # Sonner toast wrapper
│   └── index.ts
│
├── pages/                     # Route page components
│   ├── Dashboard.tsx          # All weather endpoints summary
│   ├── auth/
│   │   ├── LoginPage.tsx      # Login form
│   │   └── RegisterPage.tsx   # Registration form
│   └── weather/
│       ├── CurrentPage.tsx    # Current forecast only
│       ├── MockPage.tsx       # Mock forecast only
│       ├── SlowPage.tsx       # Slow endpoint (5s delay)
│       ├── FailedPage.tsx     # Failed endpoint demo
│       └── index.ts
│
├── providers/
│   └── index.tsx              # QueryClientProvider + Toaster
│
├── routes/
│   └── index.tsx              # createBrowserRouter config
│
├── types/                     # Global TypeScript types
│   └── index.ts               # ApiResponse<T>, PaginationInfo
│
├── hooks/                     # Placeholder — shared custom hooks
├── stores/                    # Placeholder — global state
├── styles/                    # Placeholder — global styles
└── assets/                    # Placeholder — static assets
```

## Architecture & Patterns

### Route Tree

```
/login        → AuthLayout → LoginPage
/register     → AuthLayout → RegisterPage
/             → MainLayout → Dashboard (all endpoints)
/weather/current → MainLayout → CurrentPage
/weather/mock     → MainLayout → MockPage
/weather/slow     → MainLayout → SlowPage
/weather/failed   → MainLayout → FailedPage
```

### Data Flow

1. **Pages** call React Query hooks (`useWeatherForecast`, etc.)
2. **Hooks** invoke API functions (`getWeatherForecast`, etc.) through `useQuery`
3. **API functions** use the shared Axios instance and unwrap `ApiResponse<T>`
4. **Axios interceptors** handle: request timing, logging (non-prod), error toasts

### Standard API Response

All backend endpoints return a uniform shape:

```ts
type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string | null;
  errors: Record<string, string[]> | null;
  pagination: PaginationInfo | null;
};
```

### Interceptors (registered in order)

| Order | Interceptor | Type | Purpose |
|-------|-------------|------|---------|
| 1 | `requestTimer` | Request | Records `startTime` in metadata |
| 2 | `requestLogger` | Request | Logs outgoing method/URL |
| 3 | `responseLogger` | Response | Logs elapsed time (non-prod only) |
| 4 | `responseErrorToast` | Response Error | Shows toast + handles 401 |

### Naming Conventions

- **Files:** PascalCase for components, camelCase for utilities
- **Exports:** Default export for page components, named exports for shared utilities
- **Hooks:** `use<Feature><Action>` (e.g., `useWeatherForecast`)
- **API functions:** `get<Feature><Action>` (e.g., `getWeatherForecast`)
- **Query keys:** factory pattern with `all` base key

### Query Key Factory Pattern

```ts
export const weatherKeys = {
  all: ['weather'] as const,
  forecast: () => [...weatherKeys.all, 'forecast'] as const,
  mock: () => [...weatherKeys.all, 'mock'] as const,
};
```

### Dependencies

| Package | Purpose |
|---------|---------|
| react, react-dom | UI framework |
| antd, @ant-design/icons | UI component library |
| @tanstack/react-query | Server state management |
| react-router-dom | Client-side routing |
| axios | HTTP client |
| sonner | Toast notifications |
| tailwindcss | Utility CSS |
| rsbuild + plugins | Build tooling |
