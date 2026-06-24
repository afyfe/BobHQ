namespace Bob.Api.Models;

public sealed record TenantCreateRequest(
    string? Name,
    string? PlanName);

public sealed record TenantManagementDto(
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

public sealed record TenantErrorDto(
    string Code,
    string Message,
    string? Field = null);
