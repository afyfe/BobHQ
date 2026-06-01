namespace Bob.ConnectorPersistence.Models;

public sealed record ConnectorHealthRecord(
    Guid ConnectorId,
    Guid TenantId,
    string TenantName,
    string ConnectorName,
    string ConnectorType,
    string Status,
    DateTimeOffset LastRunCompletedUtc,
    int ItemsProcessed,
    int WarningCount,
    int ErrorCount);
