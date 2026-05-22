using Bob.Api.Models;

namespace Bob.Api.Services;

public sealed class MockDashboardDataService : IDashboardDataService
{
    private readonly DashboardDto dashboard = new(
        new DashboardSummaryDto(
            ActiveTenantDeltaLabel: "+1 this week",
            ConnectorHealthPercent: 72,
            ConnectorAttentionLabel: "3 need attention",
            DocumentsIndexedDeltaLabel: "+8.4k today",
            EmailsIndexedDeltaLabel: "syncing now",
            AiRequestsToday: 1427,
            ExplainabilityRateLabel: "98.7% explainable"),
        Tenants:
        [
            new("tenant-nova", "Nova Financial", "Enterprise", "Active", 84, 6, 182450, "3 min ago"),
            new("tenant-luma", "Luma Health", "Growth", "Warning", 37, 4, 67110, "19 min ago"),
            new("tenant-harbour", "Harbour Legal", "Pilot", "Active", 18, 3, 28490, "1 hr ago")
        ],
        Connectors:
        [
            new("conn-gdrive", "Google Drive", "Nova Financial", "Healthy", "Today 14:42", null, 94620, true, null, "6 min ago", 0),
            new("conn-outlook", "Outlook Mail", "Nova Financial", "Syncing", "Today 14:18", null, 38120, true, "68% through mailbox delta", "24 min ago", 0),
            new("conn-sharepoint", "SharePoint", "Luma Health", "Degraded", "Yesterday 22:06", "Rate limit window exhausted", 31244, true, "Backoff window active", "16 hrs ago", 2),
            new("conn-slack", "Slack", "Harbour Legal", "Disabled", "May 17 09:12", "Disabled by operator", 6105, false, null, "5 days ago", 0),
            new("conn-notion", "Notion", "Luma Health", "Failed", "May 20 18:39", "OAuth token expired", 8742, true, null, "2 days ago", 4)
        ],
        Jobs:
        [
            new("job-8842", "Incremental email index", "Nova Financial", "Running", 0, "Today 14:51", null, null),
            new("job-8841", "Connector backfill", "Luma Health", "Queued", 1, "Today 14:46", null, null),
            new("job-8839", "Knowledge chunk rebuild", "Harbour Legal", "Completed", 0, "Today 13:20", "Today 13:44", null),
            new("job-8835", "Notion sync", "Luma Health", "Failed", 3, "Today 12:05", "Today 12:09", "OAuth token expired")
        ],
        AuditEntries:
        [
            new("audit-2048", "Summarise onboarding blockers for Q2 accounts", "Nova Financial", "mira@nova.example", 0.92m, 18, "Today 14:33", "Completed", "Fully sourced"),
            new("audit-2047", "Find contracts with renewal risk language", "Harbour Legal", "noah@harbour.example", 0.81m, 11, "Today 13:58", "Completed", "Fully sourced"),
            new("audit-2046", "Which accounts mention delayed implementation?", "Luma Health", "ops@luma.example", 0.64m, 5, "Today 13:41", "Partial", "Partially sourced")
        ],
        AttentionAlerts:
        [
            new("attention-sharepoint", "critical", "SharePoint connector degraded", "Luma Health", "Rate-limit backoff has left the care ops library outside freshness target.", "21 min ago", "Review connector quota and resume sync window"),
            new("attention-outlook", "warning", "Outlook Mail sync running behind", "Nova Financial", "Mailbox delta is active but currently 24 minutes behind the live queue.", "8 min ago", "Watch ingestion throughput for the next cycle"),
            new("attention-embedding", "critical", "3 failed embedding jobs need retry", "Luma Health", "Embedding generation failed after repeated token refresh errors.", "12 min ago", "Retry after Notion auth is refreshed"),
            new("attention-stale-index", "warning", "Tenant has stale index data", "Harbour Legal", "Matter archive has not completed a freshness sweep today.", "44 min ago", "Queue a targeted knowledge freshness rebuild"),
            new("attention-token", "info", "Connector auth token expires soon", "Nova Financial", "Google Drive token expires within the next 48 hours.", "1 hr ago", "Schedule credential rotation before expiry")
        ],
        TimelineEvents:
        [
            new("timeline-sharepoint-complete", "14:52", "Sync completed", "Luma Health", "SharePoint sync completed for priority care ops folders.", "Completed"),
            new("timeline-outlook-started", "14:47", "Ingestion started", "Nova Financial", "Outlook incremental ingestion entered the processing lane.", "Running"),
            new("timeline-embeddings", "14:31", "Embeddings generated", "Harbour Legal", "Generated embeddings for 2,140 updated document chunks.", "Healthy"),
            new("timeline-question", "14:18", "Question asked", "Nova Financial", "User asked for Q2 onboarding blockers with traceable sources.", "Completed"),
            new("timeline-auth", "13:55", "Auth refreshed", "Harbour Legal", "Connector credentials refreshed for Drive corpus.", "Healthy"),
            new("timeline-ocr", "13:39", "OCR retry", "Luma Health", "Failed OCR job retried after worker handoff.", "Warning")
        ],
        KnowledgeItems:
        [
            new("knowledge-drive", "Nova Financial", "Drive corpus", "Indexed", 94210, 0, "6 min"),
            new("knowledge-mail", "Nova Financial", "Mailbox archive", "Syncing", 0, 38120, "Live"),
            new("knowledge-sharepoint", "Luma Health", "SharePoint care ops", "Warning", 31244, 0, "16 hrs")
        ],
        Users:
        [
            new("user-mira", "Mira Shah", "mira@nova.example", "Owner", "Nova Financial", "Active", "4 min ago"),
            new("user-eli", "Eli Foster", "eli@bobhq.example", "Operator", "All tenants", "Active", "12 min ago"),
            new("user-ava", "Ava Ross", "ava@luma.example", "Reviewer", "Luma Health", "Invited", null)
        ],
        DiscoveryFindings:
        [
            new("discovery-systems", "Newly discovered systems", "Nova Financial", "info", 0.86m, "Review candidate systems for connector onboarding"),
            new("discovery-mailboxes", "Orphaned mailboxes", "Luma Health", "warning", 0.79m, "Confirm ownership before including in ingestion policy"),
            new("discovery-licenses", "Inactive licenses", "Harbour Legal", "info", 0.74m, "Send candidate list to tenant operations owner"),
            new("discovery-sharepoint", "Unknown SharePoint libraries", "Luma Health", "critical", 0.91m, "Map libraries to knowledge domains before indexing"),
            new("discovery-duplicates", "Duplicate documents", "Nova Financial", "warning", 0.83m, "Run duplicate clustering before next rebuild"),
            new("discovery-shadow-it", "Shadow IT indicators", "Harbour Legal", "critical", 0.68m, "Escalate systems list to BobHQ operator review")
        ]);

    public DashboardDto GetDashboard() => dashboard;
    public DashboardSummaryDto GetDashboardSummary() => dashboard.Summary;
    public IReadOnlyList<TenantDto> GetTenants() => dashboard.Tenants;
    public IReadOnlyList<ConnectorDto> GetConnectors() => dashboard.Connectors;
    public IReadOnlyList<JobDto> GetJobs() => dashboard.Jobs;
    public IReadOnlyList<KnowledgeItemDto> GetKnowledgeItems() => dashboard.KnowledgeItems;
    public IReadOnlyList<AuditEntryDto> GetAuditEntries() => dashboard.AuditEntries;
    public IReadOnlyList<DiscoveryFindingDto> GetDiscoveryFindings() => dashboard.DiscoveryFindings;
    public IReadOnlyList<AttentionAlertDto> GetAttentionAlerts() => dashboard.AttentionAlerts;
    public IReadOnlyList<ActivityEventDto> GetActivityEvents() => dashboard.TimelineEvents;
    public IReadOnlyList<UserDto> GetUsers() => dashboard.Users;
}
