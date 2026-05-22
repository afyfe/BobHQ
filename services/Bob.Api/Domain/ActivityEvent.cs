namespace Bob.Api.Domain;

public sealed record ActivityEvent(
    Guid ActivityEventId,
    Guid TenantId,
    string EventType,
    string Description,
    string Status,
    DateTime CreatedUtc);
