namespace Bob.Api.Models;

public sealed record DashboardDto(
    DashboardSummaryDto Summary,
    IReadOnlyList<TenantDto> Tenants,
    IReadOnlyList<ConnectorDto> Connectors,
    IReadOnlyList<JobDto> Jobs,
    IReadOnlyList<AuditEntryDto> AuditEntries,
    IReadOnlyList<AttentionAlertDto> AttentionAlerts,
    IReadOnlyList<ActivityEventDto> TimelineEvents,
    IReadOnlyList<KnowledgeItemDto> KnowledgeItems,
    IReadOnlyList<UserDto> Users,
    IReadOnlyList<DiscoveryFindingDto> DiscoveryFindings);

public sealed record DashboardSummaryDto(
    int? ActiveTenantCount,
    int? TotalTenantCount,
    int? ConnectorHealthPercent,
    int? DegradedConnectorCount,
    int? AttentionRequiredCount,
    int? ConnectorCycleCount,
    long? ConnectorItemsProcessed,
    int? DiscoveryFindingCount);

public sealed record TenantDto(
    string Id,
    string Name,
    string Plan,
    string Status,
    int UserCount,
    int ConnectorCount,
    int DocumentsIndexed,
    string LastActivityLabel);

public sealed record ConnectorDto(
    string Id,
    string Name,
    string TenantName,
    string Status,
    string LastSuccessfulSyncLabel,
    string? LastErrorMessage,
    int ItemsIndexed,
    bool Enabled,
    string? SyncProgressLabel,
    string LastSyncAgeLabel,
    int FailureCount);

public sealed record JobDto(
    string Id,
    string Type,
    string TenantName,
    string Status,
    int RetryCount,
    string CreatedAtLabel,
    string? CompletedAtLabel,
    string? FailureMessage);

public sealed record KnowledgeItemDto(
    string Id,
    string TenantName,
    string SourceName,
    string Status,
    int DocumentCount,
    int EmailCount,
    string FreshnessLabel);

public sealed record AuditEntryDto(
    string Id,
    string Question,
    string TenantName,
    string UserEmail,
    decimal Confidence,
    int SourceCount,
    string TimestampLabel,
    string Status,
    string ExplainabilityStatus);

public sealed record UserDto(
    string Id,
    string Name,
    string Email,
    string Role,
    string TenantScope,
    string Status,
    string? LastSeenLabel);

public sealed record DiscoveryFindingDto(
    string Id,
    string Finding,
    string TenantName,
    string Severity,
    decimal Confidence,
    string RecommendedAction);

public sealed record AttentionAlertDto(
    string Id,
    string Severity,
    string Title,
    string TenantName,
    string Description,
    string TimestampLabel,
    string SuggestedAction);

public sealed record ActivityEventDto(
    string Id,
    string TimeLabel,
    string EventType,
    string TenantName,
    string Description,
    string Status);
