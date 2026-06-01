# Connector Runtime PostgreSQL Store

This database stores operational connector telemetry only. It is separate from the existing Bob.Api dashboard schema.

Create a local PostgreSQL database:

```sql
create database bobhq_connectors;
```

Run the schema with `psql`:

```bash
psql "Host=localhost;Port=5432;Database=bobhq_connectors;Username=postgres;Password=postgres" \
  -f services/Bob.ConnectorPersistence/Database/001_connector_runtime_schema.sql
```

Enable persistence in both `services/Bob.Worker/appsettings.Development.json` and `services/Bob.Api/appsettings.Development.json`:

```json
{
  "ConnectorPersistence": {
    "Enabled": true
  },
  "ConnectionStrings": {
    "ConnectorDb": "Host=localhost;Port=5432;Database=bobhq_connectors;Username=postgres;Password=postgres"
  }
}
```

When persistence is disabled, the worker keeps logging connector execution results and the API connector telemetry endpoints return empty arrays.
