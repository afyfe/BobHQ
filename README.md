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

### Data Source Modes

Mock mode is the default and needs no database:

```json
{
  "BobApi": {
    "DataSource": "Mock"
  }
}
```

SQL read mode is opt-in. Create `services/Bob.Api/appsettings.Development.json` locally:

```json
{
  "BobApi": {
    "DataSource": "Sql"
  },
  "ConnectionStrings": {
    "BobDb": "Server=localhost;Database=BobHQ_Local;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

When `BobApi:DataSource` is `Sql`, the API reads dashboard DTOs with Dapper and `Microsoft.Data.SqlClient`. If `ConnectionStrings:BobDb` is missing or empty, startup fails clearly. Mock mode remains the safe default.

## Bob API Persistence

The SQL Server schema foundation lives at `services/Bob.Api/Database/001_initial_bobhq_schema.sql`.

The backend also includes domain records and repository interfaces under `services/Bob.Api/Domain` and `services/Bob.Api/Repositories`. These are design contracts only for now. Runtime behavior defaults to `MockDashboardDataService`, with an opt-in Dapper SQL read mode available through `BobApi:DataSource`. No EF Core, write repositories, auth, or real connector integration has been added yet.

`ConnectionStrings:BobDb` is present as an empty placeholder in `services/Bob.Api/appsettings.json` for a future SQL Server-backed implementation.

## Connector Runtime

The connector runtime foundation lives in `services/Bob.Connectors`.

It defines the operational contracts AskBob ingestion workers will use later:

- `IConnector` for executable connector implementations.
- `IConnectorRuntime` for orchestrating enabled connector runs.
- `IConnectorHealthCheck` for lightweight connector readiness checks.
- `ConnectorBase` for standard timing, status, result creation, and execution logging.
- Runtime models for execution context, items, health results, sync modes, statuses, and operational logs.

Current connector implementations are mock-only:

- `MockSharePointConnector`
- `MockOutlookConnector`
- `MockGoogleDriveConnector`

These simulate ingestion, produce fake connector items, support cancellation tokens, and emit operational logs. They do not call Microsoft Graph, Google APIs, queues, embeddings, or any external system.

The future worker model should use `ConnectorRuntimeService` as the narrow orchestration point: load enabled connector definitions, build a tenant execution context, run a sync mode, capture logs/results, and persist outcomes. The runtime is intentionally focused on ingestion operations rather than generic admin CRUD.

Run the manual sandbox:

```bash
cd tools/ConnectorSandbox
dotnet run
```
