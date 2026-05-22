namespace Bob.Api.Domain;

public sealed record ConnectorRun(
    Guid ConnectorRunId,
    Guid ConnectorId,
    Guid TenantId,
    string Status,
    string? ProgressText,
    DateTime StartedUtc,
    DateTime? CompletedUtc,
    int FailureCount,
    string? ErrorMessage,
    DateTime CreatedUtc,
    DateTime UpdatedUtc);
