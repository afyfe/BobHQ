namespace Bob.ConnectorPersistence.Models;

public sealed record ConnectorCycleSummary(
    Guid ConnectorCycleSummaryId,
    Guid TenantId,
    string TenantName,
    DateTimeOffset StartedUtc,
    DateTimeOffset CompletedUtc,
    int ConnectorCount,
    int ItemsProcessed,
    int FailedCount,
    int DegradedCount);
