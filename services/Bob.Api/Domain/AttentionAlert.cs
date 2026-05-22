namespace Bob.Api.Domain;

public sealed record AttentionAlert(
    Guid AttentionAlertId,
    Guid TenantId,
    string Severity,
    string Title,
    string Description,
    string SuggestedAction,
    string Status,
    DateTime CreatedUtc,
    DateTime UpdatedUtc);
