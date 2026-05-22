namespace Bob.Api.Domain;

public sealed record User(
    Guid UserId,
    Guid? TenantId,
    string DisplayName,
    string Email,
    string RoleName,
    string TenantScope,
    string Status,
    DateTime? LastSeenUtc,
    DateTime CreatedUtc,
    DateTime UpdatedUtc);
