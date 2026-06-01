namespace Bob.ConnectorPersistence.Models;

public sealed record ConnectorRunRecord(
    Guid ConnectorRunId,
    Guid ConnectorId,
    Guid TenantId,
    string TenantName,
    string ConnectorName,
    string ConnectorType,
    string Status,
    DateTimeOffset StartedUtc,
    DateTimeOffset CompletedUtc,
    long DurationMilliseconds,
    int ItemsProcessed,
    int WarningCount,
    int ErrorCount);
