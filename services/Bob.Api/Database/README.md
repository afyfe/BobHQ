# BobHQ Local Database Bootstrap

These scripts are for local development/bootstrap only. They avoid destructive drops and use deterministic IDs with `IF NOT EXISTS` guards where practical, but they are not a migration system.

## Create Local Database

Using `sqlcmd` against a local SQL Server instance:

```powershell
sqlcmd -S localhost -E -Q "IF DB_ID('BobHQ_Local') IS NULL CREATE DATABASE BobHQ_Local"
```

For SQL Server Express, use `localhost\SQLEXPRESS` instead of `localhost`.

## Run Schema

```powershell
sqlcmd -S localhost -E -d BobHQ_Local -i services/Bob.Api/Database/001_initial_bobhq_schema.sql
```

## Seed Demo Data

```powershell
sqlcmd -S localhost -E -d BobHQ_Local -i services/Bob.Api/Database/002_seed_demo_data.sql
```

The seed data mirrors the current `MockDashboardDataService` demo cockpit data and can be rerun without inserting duplicate deterministic rows.

## Development Connection String

Create `services/Bob.Api/appsettings.Development.json` locally:

```json
{
  "ConnectionStrings": {
    "BobDb": "Server=localhost;Database=BobHQ_Local;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

Runtime still uses `MockDashboardDataService`. The database is not wired into the API yet.
