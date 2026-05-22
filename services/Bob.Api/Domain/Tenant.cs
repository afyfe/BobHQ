namespace Bob.Api.Domain;

public sealed record Tenant(
    Guid TenantId,
    string Name,
    string PlanName,
    string Status,
    int UserCount,
    int ConnectorCount,
    int DocumentsIndexed,
    DateTime? LastActivityUtc,
    DateTime CreatedUtc,
    DateTime UpdatedUtc);
