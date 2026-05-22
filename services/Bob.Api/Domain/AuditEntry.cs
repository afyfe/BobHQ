namespace Bob.Api.Domain;

public sealed record AuditEntry(
    Guid AuditEntryId,
    Guid TenantId,
    Guid? UserId,
    string Question,
    string UserEmail,
    decimal Confidence,
    int SourceCount,
    string Status,
    string ExplainabilityStatus,
    DateTime CreatedUtc,
    DateTime UpdatedUtc);
