namespace Bob.Api.Domain;

public sealed record Job(
    Guid JobId,
    Guid TenantId,
    string JobType,
    string Status,
    int RetryCount,
    DateTime CreatedUtc,
    DateTime? CompletedUtc,
    string? FailureMessage,
    DateTime UpdatedUtc);
