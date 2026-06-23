# Connector Runtime SQL Server Store

This database stores operational connector telemetry only. It is separate from the existing Bob.Api dashboard schema.

Create a local SQL Server database:

```sql
create database AskBobLocal;
```

Run the schema:

```powershell
sqlcmd -S localhost -d AskBobLocal -E -i services/Bob.ConnectorPersistence/Database/sqlserver/001_connector_runtime_schema.sql
```

Enable persistence in both `services/Bob.Worker/appsettings.Development.json` and `services/Bob.Api/appsettings.Development.json`:

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

When persistence is disabled, the worker keeps logging connector execution results and the API connector telemetry endpoints return empty arrays.
