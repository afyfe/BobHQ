namespace Bob.Api.Domain;

public sealed record Connector(
    Guid ConnectorId,
    Guid TenantId,
    string Name,
    string Status,
    DateTime? LastSuccessfulSyncUtc,
    string? LastErrorMessage,
    int ItemsIndexed,
    bool IsEnabled,
    string? SyncProgressLabel,
    int FailureCount,
    DateTime CreatedUtc,
    DateTime UpdatedUtc);
