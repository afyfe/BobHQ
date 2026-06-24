# BobHQ Control Centre

Initial React, TypeScript, and Vite foundation for the AskBob internal operational cockpit.

## Scripts

```bash
cd apps/control-centre
npm install
npm run dev
npm run build
```

Most dashboard pages still use mock data. The connectors view now reads live telemetry from the Bob API connector endpoints.

## Frontend Data Layer

The control centre pages call `src/services/dashboardService.ts` for dashboard data instead of importing fixtures directly.

The service currently returns typed mock data from `src/data/mockDashboardData.ts` for most dashboard surfaces, with a short simulated delay so loading states are visible during development. Connector health is wired through `src/services/connectorTelemetryService.ts` and calls the live `/api/connectors/latest`, `/api/connectors/health`, and `/api/connectors/runs` endpoints. Tenant lists are read from `/api/tenants`.

## Admin Shell

The control centre includes an `/admin` route with a Tenant Management page and a disabled Create Tenant modal placeholder. Authentication is intentionally external for now.

Before tenant creation is enabled in the UI or exposed publicly, `hq.askbob.live` must be protected by Cloudflare Access. Bob.Api tenant-management endpoints are temporarily unauthenticated so Cloudflare Access can be the enforcement boundary; do not expose them on an unprotected public origin.

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

## Bob Worker

`services/Bob.Worker` is the .NET 8 Worker Service host for connector ingestion runs.

For now it is mock-only. It references `Bob.Connectors`, registers the mock SharePoint, Outlook, and Google Drive connectors, and runs `ConnectorRuntimeService` on startup and then on a configurable timer. Connector results, timings, warnings, errors, and per-connector operational messages are written through `ILogger`.

Run locally:

```bash
cd services/Bob.Worker
dotnet run
```

Worker settings live under `ConnectorWorker` in `appsettings.json`:

- `TenantId`
- `TenantName`
- `SyncMode`
- `RunOnStartup`
- `IntervalSeconds`

The worker is prepared for Linux service hosting with `services/Bob.Worker/deploy/bob-worker.service`. Publish and install manually when needed:

```bash
cd services/Bob.Worker
dotnet publish -c Release -o /opt/bobhq/Bob.Worker
sudo cp deploy/bob-worker.service /etc/systemd/system/bob-worker.service
sudo systemctl daemon-reload
sudo systemctl enable --now bob-worker
```

Indexed-item and job persistence remain future work. The worker keeps operational `ILogger` output whether connector-run persistence is enabled or not.

## Connector Run Persistence

Connector execution telemetry can be stored in SQL Server through `services/Bob.ConnectorPersistence`.

The operational store contains:

- `ConnectorRuns`
- `ConnectorRunLogs`
- `ConnectorWarnings`
- `ConnectorCycleSummaries`

Persistence is disabled by default so mock connector runs still work without a database. To enable it, apply `services/Bob.ConnectorPersistence/Database/sqlserver/001_connector_runtime_schema.sql` and configure both `Bob.Worker` and `Bob.Api`:

```json
{
  "ConnectorPersistence": {
    "Enabled": true
  },
  "ConnectionStrings": {
    "AskBobSql": "Server=localhost;Database=AskBobLocal;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

The worker continues to emit `ILogger` output and additionally persists each connector result, per-run log messages, warnings, errors, and cycle summaries.

Bob.Api exposes connector telemetry read endpoints:

- `GET /api/connectors/runs`
- `GET /api/connectors/health`
- `GET /api/connectors/latest`

Bob.Api also exposes tenant-management endpoints:

- `GET /api/tenants`
- `GET /api/tenants/{tenantId}`
- `POST /api/tenants`

`POST /api/tenants` defaults `PlanName` to `Internal Preview` and `Status` to `Active`, validates that `Name` is present, and returns `409` when a tenant name already exists.

See `services/Bob.ConnectorPersistence/Database/README.md` for local SQL Server bootstrap steps.
