namespace Bob.Api.Domain;

public sealed record KnowledgeItem(
    Guid KnowledgeItemId,
    Guid TenantId,
    string SourceName,
    string Status,
    int DocumentCount,
    int EmailCount,
    DateTime? FreshnessUtc,
    DateTime CreatedUtc,
    DateTime UpdatedUtc);
