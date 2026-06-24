using Bob.Api.Data;
using Bob.Api.Models;
using Dapper;

namespace Bob.Api.Services;

public sealed class SqlDashboardDataService : IDashboardDataService
{
    private readonly ISqlConnectionFactory connectionFactory;

    public SqlDashboardDataService(ISqlConnectionFactory connectionFactory)
    {
        this.connectionFactory = connectionFactory;
    }

    public DashboardDto GetDashboard() => new(
        GetDashboardSummary(),
        GetTenants(),
        GetConnectors(),
        GetJobs(),
        GetAuditEntries(),
        GetAttentionAlerts(),
        GetActivityEvents(),
        GetKnowledgeItems(),
        GetUsers(),
        GetDiscoveryFindings());

    public DashboardSummaryDto GetDashboardSummary()
    {
        using var connection = connectionFactory.CreateConnection();

        var tenantSummary = GetTenantSummary(connection);
        var connectorSummary = GetConnectorRunSummary(connection);
        var attentionSummary = GetAttentionSummary(connection);
        var cycleSummary = GetConnectorCycleSummary(connection);
        var discoverySummary = GetDiscoverySummary(connection);

        return new DashboardSummaryDto(
            ActiveTenantCount: tenantSummary?.ActiveCount,
            TotalTenantCount: tenantSummary?.TotalCount,
            ConnectorHealthPercent: connectorSummary?.HealthPercent,
            DegradedConnectorCount: connectorSummary?.DegradedCount,
            AttentionRequiredCount: attentionSummary?.OpenCount,
            ConnectorCycleCount: cycleSummary?.CycleCount,
            ConnectorItemsProcessed: cycleSummary?.ItemsProcessed,
            DiscoveryFindingCount: discoverySummary?.FindingCount);
    }

    public IReadOnlyList<TenantDto> GetTenants()
    {
        const string sql = """
            select
                cast(TenantId as nvarchar(36)) as Id,
                Name,
                PlanName as [Plan],
                Status,
                UserCount,
                ConnectorCount,
                DocumentsIndexed,
                case
                    when LastActivityUtc is null then '-'
                    when datediff(minute, LastActivityUtc, sysutcdatetime()) < 60 then concat(datediff(minute, LastActivityUtc, sysutcdatetime()), ' min ago')
                    when datediff(hour, LastActivityUtc, sysutcdatetime()) < 24 then concat(datediff(hour, LastActivityUtc, sysutcdatetime()), ' hr ago')
                    else concat(datediff(day, LastActivityUtc, sysutcdatetime()), ' days ago')
                end as LastActivityLabel
            from dbo.Tenants
            order by Name;
            """;

        using var connection = connectionFactory.CreateConnection();
        return connection.Query<TenantDto>(sql).AsList();
    }

    public IReadOnlyList<ConnectorDto> GetConnectors()
    {
        const string sql = """
            select
                cast(c.ConnectorId as nvarchar(36)) as Id,
                c.Name,
                t.Name as TenantName,
                c.Status,
                coalesce(format(c.LastSuccessfulSyncUtc, 'MMM dd HH:mm'), '-') as LastSuccessfulSyncLabel,
                c.LastErrorMessage,
                c.ItemsIndexed,
                cast(c.IsEnabled as bit) as Enabled,
                coalesce(c.SyncProgressLabel, latestRun.ProgressText) as SyncProgressLabel,
                case
                    when c.LastSuccessfulSyncUtc is null then '-'
                    when datediff(minute, c.LastSuccessfulSyncUtc, sysutcdatetime()) < 60 then concat(datediff(minute, c.LastSuccessfulSyncUtc, sysutcdatetime()), ' min ago')
                    when datediff(hour, c.LastSuccessfulSyncUtc, sysutcdatetime()) < 24 then concat(datediff(hour, c.LastSuccessfulSyncUtc, sysutcdatetime()), ' hrs ago')
                    else concat(datediff(day, c.LastSuccessfulSyncUtc, sysutcdatetime()), ' days ago')
                end as LastSyncAgeLabel,
                case
                    when latestRun.FailureCount is not null and latestRun.FailureCount > c.FailureCount then latestRun.FailureCount
                    else c.FailureCount
                end as FailureCount
            from dbo.Connectors c
            inner join dbo.Tenants t on t.TenantId = c.TenantId
            outer apply (
                select top 1
                    cr.ProgressText,
                    cr.FailureCount
                from dbo.ConnectorRuns cr
                where cr.ConnectorId = c.ConnectorId
                order by cr.StartedUtc desc
            ) latestRun
            order by t.Name, c.Name;
            """;

        using var connection = connectionFactory.CreateConnection();
        return connection.Query<ConnectorDto>(sql).AsList();
    }

    public IReadOnlyList<JobDto> GetJobs()
    {
        const string sql = """
            select
                cast(j.JobId as nvarchar(36)) as Id,
                j.JobType as [Type],
                t.Name as TenantName,
                j.Status,
                j.RetryCount,
                format(j.CreatedUtc, 'MMM dd HH:mm') as CreatedAtLabel,
                case when j.CompletedUtc is null then null else format(j.CompletedUtc, 'MMM dd HH:mm') end as CompletedAtLabel,
                j.FailureMessage
            from dbo.Jobs j
            inner join dbo.Tenants t on t.TenantId = j.TenantId
            order by j.CreatedUtc desc;
            """;

        using var connection = connectionFactory.CreateConnection();
        return connection.Query<JobDto>(sql).AsList();
    }

    public IReadOnlyList<KnowledgeItemDto> GetKnowledgeItems()
    {
        const string sql = """
            select
                cast(k.KnowledgeItemId as nvarchar(36)) as Id,
                t.Name as TenantName,
                k.SourceName,
                k.Status,
                k.DocumentCount,
                k.EmailCount,
                case
                    when k.FreshnessUtc is null then '-'
                    when datediff(minute, k.FreshnessUtc, sysutcdatetime()) < 2 then 'Live'
                    when datediff(minute, k.FreshnessUtc, sysutcdatetime()) < 60 then concat(datediff(minute, k.FreshnessUtc, sysutcdatetime()), ' min')
                    when datediff(hour, k.FreshnessUtc, sysutcdatetime()) < 24 then concat(datediff(hour, k.FreshnessUtc, sysutcdatetime()), ' hrs')
                    else concat(datediff(day, k.FreshnessUtc, sysutcdatetime()), ' days')
                end as FreshnessLabel
            from dbo.KnowledgeItems k
            inner join dbo.Tenants t on t.TenantId = k.TenantId
            order by t.Name, k.SourceName;
            """;

        using var connection = connectionFactory.CreateConnection();
        return connection.Query<KnowledgeItemDto>(sql).AsList();
    }

    public IReadOnlyList<AuditEntryDto> GetAuditEntries()
    {
        const string sql = """
            select
                cast(a.AuditEntryId as nvarchar(36)) as Id,
                a.Question,
                t.Name as TenantName,
                a.UserEmail,
                a.Confidence,
                a.SourceCount,
                format(a.CreatedUtc, 'MMM dd HH:mm') as TimestampLabel,
                a.Status,
                a.ExplainabilityStatus
            from dbo.AuditEntries a
            inner join dbo.Tenants t on t.TenantId = a.TenantId
            order by a.CreatedUtc desc;
            """;

        using var connection = connectionFactory.CreateConnection();
        return connection.Query<AuditEntryDto>(sql).AsList();
    }

    public IReadOnlyList<DiscoveryFindingDto> GetDiscoveryFindings()
    {
        const string sql = """
            select
                cast(d.DiscoveryFindingId as nvarchar(36)) as Id,
                d.Finding,
                t.Name as TenantName,
                d.Severity,
                d.Confidence,
                d.RecommendedAction
            from dbo.DiscoveryFindings d
            inner join dbo.Tenants t on t.TenantId = d.TenantId
            order by d.CreatedUtc desc;
            """;

        using var connection = connectionFactory.CreateConnection();
        return connection.Query<DiscoveryFindingDto>(sql).AsList();
    }

    public IReadOnlyList<AttentionAlertDto> GetAttentionAlerts()
    {
        const string sql = """
            select
                cast(a.AttentionAlertId as nvarchar(36)) as Id,
                a.Severity,
                a.Title,
                t.Name as TenantName,
                a.Description,
                case
                    when datediff(minute, a.CreatedUtc, sysutcdatetime()) < 60 then concat(datediff(minute, a.CreatedUtc, sysutcdatetime()), ' min ago')
                    when datediff(hour, a.CreatedUtc, sysutcdatetime()) < 24 then concat(datediff(hour, a.CreatedUtc, sysutcdatetime()), ' hr ago')
                    else concat(datediff(day, a.CreatedUtc, sysutcdatetime()), ' days ago')
                end as TimestampLabel,
                a.SuggestedAction
            from dbo.AttentionAlerts a
            inner join dbo.Tenants t on t.TenantId = a.TenantId
            where a.Status = 'Open'
            order by a.CreatedUtc desc;
            """;

        using var connection = connectionFactory.CreateConnection();
        return connection.Query<AttentionAlertDto>(sql).AsList();
    }

    public IReadOnlyList<ActivityEventDto> GetActivityEvents()
    {
        const string sql = """
            select
                cast(e.ActivityEventId as nvarchar(36)) as Id,
                format(e.CreatedUtc, 'HH:mm') as TimeLabel,
                e.EventType,
                t.Name as TenantName,
                e.Description,
                e.Status
            from dbo.ActivityEvents e
            inner join dbo.Tenants t on t.TenantId = e.TenantId
            order by e.CreatedUtc desc;
            """;

        using var connection = connectionFactory.CreateConnection();
        return connection.Query<ActivityEventDto>(sql).AsList();
    }

    public IReadOnlyList<UserDto> GetUsers()
    {
        const string sql = """
            select
                cast(u.UserId as nvarchar(36)) as Id,
                u.DisplayName as Name,
                u.Email,
                u.RoleName as [Role],
                u.TenantScope,
                u.Status,
                case
                    when u.LastSeenUtc is null then null
                    when datediff(minute, u.LastSeenUtc, sysutcdatetime()) < 60 then concat(datediff(minute, u.LastSeenUtc, sysutcdatetime()), ' min ago')
                    when datediff(hour, u.LastSeenUtc, sysutcdatetime()) < 24 then concat(datediff(hour, u.LastSeenUtc, sysutcdatetime()), ' hr ago')
                    else concat(datediff(day, u.LastSeenUtc, sysutcdatetime()), ' days ago')
                end as LastSeenLabel
            from dbo.Users u
            order by u.DisplayName;
            """;

        using var connection = connectionFactory.CreateConnection();
        return connection.Query<UserDto>(sql).AsList();
    }

    private static TenantSummary? GetTenantSummary(System.Data.IDbConnection connection)
    {
        if (!TableExists(connection, "Tenants"))
        {
            return null;
        }

        var totalCount = connection.ExecuteScalar<int>("select count(*) from dbo.Tenants;");

        if (totalCount == 0)
        {
            return null;
        }

        var activeCount = connection.ExecuteScalar<int>("select count(*) from dbo.Tenants where Status = 'Active';");
        return new TenantSummary(totalCount, activeCount);
    }

    private static ConnectorRunSummary? GetConnectorRunSummary(System.Data.IDbConnection connection)
    {
        if (!TableExists(connection, "ConnectorRuns"))
        {
            return null;
        }

        const string totalSql = """
            with LatestRuns as
            (
                select
                    row_number() over (partition by ConnectorId order by StartedUtc desc) as RowNumber
                from dbo.ConnectorRuns
            )
            select count(*)
            from LatestRuns
            where RowNumber = 1;
            """;

        var totalCount = connection.ExecuteScalar<int>(totalSql);

        if (totalCount == 0)
        {
            return null;
        }

        const string healthySql = """
            with LatestRuns as
            (
                select
                    Status,
                    row_number() over (partition by ConnectorId order by StartedUtc desc) as RowNumber
                from dbo.ConnectorRuns
            )
            select count(*)
            from LatestRuns
            where RowNumber = 1 and Status in ('Healthy', 'Completed');
            """;

        const string degradedSql = """
            with LatestRuns as
            (
                select
                    Status,
                    row_number() over (partition by ConnectorId order by StartedUtc desc) as RowNumber
                from dbo.ConnectorRuns
            )
            select count(*)
            from LatestRuns
            where RowNumber = 1 and Status in ('Degraded', 'Failed', 'Error');
            """;

        return new ConnectorRunSummary(
            totalCount,
            connection.ExecuteScalar<int>(healthySql),
            connection.ExecuteScalar<int>(degradedSql));
    }

    private static AttentionSummary? GetAttentionSummary(System.Data.IDbConnection connection)
    {
        if (!TableExists(connection, "AttentionAlerts"))
        {
            return null;
        }

        var totalCount = connection.ExecuteScalar<int>("select count(*) from dbo.AttentionAlerts;");

        if (totalCount == 0)
        {
            return null;
        }

        var openCount = connection.ExecuteScalar<int>("select count(*) from dbo.AttentionAlerts where Status = 'Open';");
        return new AttentionSummary(totalCount, openCount);
    }

    private static ConnectorCycleSummaryMetrics? GetConnectorCycleSummary(System.Data.IDbConnection connection)
    {
        if (!TableExists(connection, "ConnectorCycleSummaries"))
        {
            return null;
        }

        var cycleCount = connection.ExecuteScalar<int>("select count(*) from dbo.ConnectorCycleSummaries;");

        if (cycleCount == 0)
        {
            return null;
        }

        var itemsProcessed = connection.ExecuteScalar<long>(
            "select coalesce(sum(cast(ItemsProcessed as bigint)), 0) from dbo.ConnectorCycleSummaries;");

        return new ConnectorCycleSummaryMetrics(cycleCount, itemsProcessed);
    }

    private static DiscoverySummary? GetDiscoverySummary(System.Data.IDbConnection connection)
    {
        if (!TableExists(connection, "DiscoveryFindings"))
        {
            return null;
        }

        var findingCount = connection.ExecuteScalar<int>("select count(*) from dbo.DiscoveryFindings;");
        return findingCount == 0 ? null : new DiscoverySummary(findingCount);
    }

    private static bool TableExists(System.Data.IDbConnection connection, string tableName)
    {
        const string sql = """
            select count(*)
            from sys.tables tableInfo
            inner join sys.schemas schemaInfo on schemaInfo.schema_id = tableInfo.schema_id
            where schemaInfo.name = 'dbo' and tableInfo.name = @TableName;
            """;

        return connection.ExecuteScalar<int>(sql, new { TableName = tableName }) > 0;
    }

    private sealed record TenantSummary(int TotalCount, int ActiveCount);

    private sealed record ConnectorRunSummary(int TotalCount, int HealthyCount, int DegradedCount)
    {
        public int HealthPercent => TotalCount == 0 ? 0 : (int)Math.Round(HealthyCount * 100m / TotalCount);
    }

    private sealed record AttentionSummary(int TotalCount, int OpenCount);

    private sealed record ConnectorCycleSummaryMetrics(int CycleCount, long ItemsProcessed);

    private sealed record DiscoverySummary(int FindingCount);
}
