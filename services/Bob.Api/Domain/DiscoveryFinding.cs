namespace Bob.Api.Domain;

public sealed record DiscoveryFinding(
    Guid DiscoveryFindingId,
    Guid TenantId,
    string Finding,
    string Severity,
    decimal Confidence,
    string RecommendedAction,
    string Status,
    DateTime CreatedUtc,
    DateTime UpdatedUtc);
