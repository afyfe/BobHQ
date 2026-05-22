namespace Bob.Connectors.Models;

public sealed record ConnectorExecutionContext(
    Guid TenantId,
    string TenantName,
    Guid ConnectorId,
    string ConnectorName,
    ConnectorType ConnectorType,
    ConnectorSyncMode SyncMode,
    DateTimeOffset RequestedUtc,
    IReadOnlyDictionary<string, string>? Options = null);
