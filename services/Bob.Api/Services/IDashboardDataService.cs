using Bob.Api.Models;

namespace Bob.Api.Services;

public interface IDashboardDataService
{
    DashboardDto GetDashboard();
    DashboardSummaryDto GetDashboardSummary();
    IReadOnlyList<TenantDto> GetTenants();
    IReadOnlyList<ConnectorDto> GetConnectors();
    IReadOnlyList<JobDto> GetJobs();
    IReadOnlyList<KnowledgeItemDto> GetKnowledgeItems();
    IReadOnlyList<AuditEntryDto> GetAuditEntries();
    IReadOnlyList<DiscoveryFindingDto> GetDiscoveryFindings();
    IReadOnlyList<AttentionAlertDto> GetAttentionAlerts();
    IReadOnlyList<ActivityEventDto> GetActivityEvents();
    IReadOnlyList<UserDto> GetUsers();
}
