# BobHQ Control Centre

Initial React, TypeScript, and Vite foundation for the AskBob internal operational cockpit.

## Scripts

```bash
cd apps/control-centre
npm install
npm run dev
npm run build
```

The current UI uses mock data only. Backend wiring can be added behind the `src/services` layer without changing page components.

## Frontend Data Layer

The control centre pages call `src/services/dashboardService.ts` for dashboard data instead of importing fixtures directly.

The service currently returns typed mock data from `src/data/mockDashboardData.ts` with a short simulated delay so loading states are visible during development. Future AskBob HQ API wiring can replace the service implementation without changing page-level UI code.

`VITE_API_BASE_URL` is supported by `src/lib/apiClient.ts` and will point to the future BobHQ API base URL when backend integration starts.

## Bob API

```bash
cd services/Bob.Api
dotnet run
```

The API is a .NET 8 Minimal API with mock operational data only. It exposes `/health` plus initial `/api/*` dashboard endpoints and allows local Vite dev requests from `http://localhost:5173`.

## Bob API Persistence

The SQL Server schema foundation lives at `services/Bob.Api/Database/001_initial_bobhq_schema.sql`.

The backend also includes domain records and repository interfaces under `services/Bob.Api/Domain` and `services/Bob.Api/Repositories`. These are design contracts only for now. Runtime behavior still uses `MockDashboardDataService`; no EF Core, Dapper, database connection, auth, or real connector integration has been added yet.

`ConnectionStrings:BobDb` is present as an empty placeholder in `services/Bob.Api/appsettings.json` for a future SQL Server-backed implementation.
