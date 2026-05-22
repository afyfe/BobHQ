-- BobHQ demo seed data.
-- Dev/bootstrap only. Safe-ish to rerun: rows are inserted only when their deterministic IDs do not exist.
-- Run after 001_initial_bobhq_schema.sql.

DECLARE @NovaTenantId uniqueidentifier = '11111111-1111-1111-1111-111111111111';
DECLARE @LumaTenantId uniqueidentifier = '22222222-2222-2222-2222-222222222222';
DECLARE @HarbourTenantId uniqueidentifier = '33333333-3333-3333-3333-333333333333';

DECLARE @MiraUserId uniqueidentifier = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1';
DECLARE @EliUserId uniqueidentifier = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2';
DECLARE @AvaUserId uniqueidentifier = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3';

DECLARE @DriveConnectorId uniqueidentifier = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01';
DECLARE @OutlookConnectorId uniqueidentifier = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02';
DECLARE @SharePointConnectorId uniqueidentifier = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03';
DECLARE @SlackConnectorId uniqueidentifier = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb04';
DECLARE @NotionConnectorId uniqueidentifier = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb05';

IF NOT EXISTS (SELECT 1 FROM dbo.Tenants WHERE TenantId = @NovaTenantId)
BEGIN
    INSERT INTO dbo.Tenants (TenantId, Name, PlanName, Status, UserCount, ConnectorCount, DocumentsIndexed, LastActivityUtc, CreatedUtc, UpdatedUtc)
    VALUES
        (@NovaTenantId, 'Nova Financial', 'Enterprise', 'Active', 84, 6, 182450, dateadd(minute, -3, sysutcdatetime()), sysutcdatetime(), sysutcdatetime()),
        (@LumaTenantId, 'Luma Health', 'Growth', 'Warning', 37, 4, 67110, dateadd(minute, -19, sysutcdatetime()), sysutcdatetime(), sysutcdatetime()),
        (@HarbourTenantId, 'Harbour Legal', 'Pilot', 'Active', 18, 3, 28490, dateadd(hour, -1, sysutcdatetime()), sysutcdatetime(), sysutcdatetime());
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserId = @MiraUserId)
BEGIN
    INSERT INTO dbo.Users (UserId, TenantId, DisplayName, Email, RoleName, TenantScope, Status, LastSeenUtc, CreatedUtc, UpdatedUtc)
    VALUES
        (@MiraUserId, @NovaTenantId, 'Mira Shah', 'mira@nova.example', 'Owner', 'Nova Financial', 'Active', dateadd(minute, -4, sysutcdatetime()), sysutcdatetime(), sysutcdatetime()),
        (@EliUserId, NULL, 'Eli Foster', 'eli@bobhq.example', 'Operator', 'All tenants', 'Active', dateadd(minute, -12, sysutcdatetime()), sysutcdatetime(), sysutcdatetime()),
        (@AvaUserId, @LumaTenantId, 'Ava Ross', 'ava@luma.example', 'Reviewer', 'Luma Health', 'Invited', NULL, sysutcdatetime(), sysutcdatetime());
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Connectors WHERE ConnectorId = @DriveConnectorId)
BEGIN
    INSERT INTO dbo.Connectors (ConnectorId, TenantId, Name, Status, LastSuccessfulSyncUtc, LastErrorMessage, ItemsIndexed, IsEnabled, SyncProgressLabel, FailureCount, CreatedUtc, UpdatedUtc)
    VALUES
        (@DriveConnectorId, @NovaTenantId, 'Google Drive', 'Healthy', dateadd(minute, -6, sysutcdatetime()), NULL, 94620, 1, NULL, 0, sysutcdatetime(), sysutcdatetime()),
        (@OutlookConnectorId, @NovaTenantId, 'Outlook Mail', 'Syncing', dateadd(minute, -24, sysutcdatetime()), NULL, 38120, 1, '68% through mailbox delta', 0, sysutcdatetime(), sysutcdatetime()),
        (@SharePointConnectorId, @LumaTenantId, 'SharePoint', 'Degraded', dateadd(hour, -16, sysutcdatetime()), 'Rate limit window exhausted', 31244, 1, 'Backoff window active', 2, sysutcdatetime(), sysutcdatetime()),
        (@SlackConnectorId, @HarbourTenantId, 'Slack', 'Disabled', dateadd(day, -5, sysutcdatetime()), 'Disabled by operator', 6105, 0, NULL, 0, sysutcdatetime(), sysutcdatetime()),
        (@NotionConnectorId, @LumaTenantId, 'Notion', 'Failed', dateadd(day, -2, sysutcdatetime()), 'OAuth token expired', 8742, 1, NULL, 4, sysutcdatetime(), sysutcdatetime());
END;

IF NOT EXISTS (SELECT 1 FROM dbo.ConnectorRuns WHERE ConnectorRunId = 'cccccccc-cccc-cccc-cccc-cccccccccc01')
BEGIN
    INSERT INTO dbo.ConnectorRuns (ConnectorRunId, ConnectorId, TenantId, Status, ProgressText, StartedUtc, CompletedUtc, FailureCount, ErrorMessage, CreatedUtc, UpdatedUtc)
    VALUES
        ('cccccccc-cccc-cccc-cccc-cccccccccc01', @OutlookConnectorId, @NovaTenantId, 'Syncing', '68% through mailbox delta', dateadd(minute, -24, sysutcdatetime()), NULL, 0, NULL, sysutcdatetime(), sysutcdatetime()),
        ('cccccccc-cccc-cccc-cccc-cccccccccc02', @SharePointConnectorId, @LumaTenantId, 'Degraded', 'Backoff window active', dateadd(hour, -16, sysutcdatetime()), NULL, 2, 'Rate limit window exhausted', sysutcdatetime(), sysutcdatetime()),
        ('cccccccc-cccc-cccc-cccc-cccccccccc03', @NotionConnectorId, @LumaTenantId, 'Failed', NULL, dateadd(day, -2, sysutcdatetime()), dateadd(day, -2, dateadd(minute, 4, sysutcdatetime())), 4, 'OAuth token expired', sysutcdatetime(), sysutcdatetime());
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Jobs WHERE JobId = 'dddddddd-dddd-dddd-dddd-dddddddddd01')
BEGIN
    INSERT INTO dbo.Jobs (JobId, TenantId, JobType, Status, RetryCount, CreatedUtc, CompletedUtc, FailureMessage, UpdatedUtc)
    VALUES
        ('dddddddd-dddd-dddd-dddd-dddddddddd01', @NovaTenantId, 'Incremental email index', 'Running', 0, dateadd(minute, -9, sysutcdatetime()), NULL, NULL, sysutcdatetime()),
        ('dddddddd-dddd-dddd-dddd-dddddddddd02', @LumaTenantId, 'Connector backfill', 'Queued', 1, dateadd(minute, -14, sysutcdatetime()), NULL, NULL, sysutcdatetime()),
        ('dddddddd-dddd-dddd-dddd-dddddddddd03', @HarbourTenantId, 'Knowledge chunk rebuild', 'Completed', 0, dateadd(hour, -2, sysutcdatetime()), dateadd(minute, -76, sysutcdatetime()), NULL, sysutcdatetime()),
        ('dddddddd-dddd-dddd-dddd-dddddddddd04', @LumaTenantId, 'Notion sync', 'Failed', 3, dateadd(hour, -3, sysutcdatetime()), dateadd(minute, -171, sysutcdatetime()), 'OAuth token expired', sysutcdatetime());
END;

IF NOT EXISTS (SELECT 1 FROM dbo.KnowledgeItems WHERE KnowledgeItemId = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01')
BEGIN
    INSERT INTO dbo.KnowledgeItems (KnowledgeItemId, TenantId, SourceName, Status, DocumentCount, EmailCount, FreshnessUtc, CreatedUtc, UpdatedUtc)
    VALUES
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', @NovaTenantId, 'Drive corpus', 'Indexed', 94210, 0, dateadd(minute, -6, sysutcdatetime()), sysutcdatetime(), sysutcdatetime()),
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', @NovaTenantId, 'Mailbox archive', 'Syncing', 0, 38120, sysutcdatetime(), sysutcdatetime(), sysutcdatetime()),
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', @LumaTenantId, 'SharePoint care ops', 'Warning', 31244, 0, dateadd(hour, -16, sysutcdatetime()), sysutcdatetime(), sysutcdatetime());
END;

IF NOT EXISTS (SELECT 1 FROM dbo.AuditEntries WHERE AuditEntryId = '99999999-9999-9999-9999-999999999901')
BEGIN
    INSERT INTO dbo.AuditEntries (AuditEntryId, TenantId, UserId, Question, UserEmail, Confidence, SourceCount, Status, ExplainabilityStatus, CreatedUtc, UpdatedUtc)
    VALUES
        ('99999999-9999-9999-9999-999999999901', @NovaTenantId, @MiraUserId, 'Summarise onboarding blockers for Q2 accounts', 'mira@nova.example', 0.9200, 18, 'Completed', 'Fully sourced', dateadd(minute, -27, sysutcdatetime()), sysutcdatetime()),
        ('99999999-9999-9999-9999-999999999902', @HarbourTenantId, NULL, 'Find contracts with renewal risk language', 'noah@harbour.example', 0.8100, 11, 'Completed', 'Fully sourced', dateadd(hour, -1, sysutcdatetime()), sysutcdatetime()),
        ('99999999-9999-9999-9999-999999999903', @LumaTenantId, NULL, 'Which accounts mention delayed implementation?', 'ops@luma.example', 0.6400, 5, 'Partial', 'Partially sourced', dateadd(hour, -1, sysutcdatetime()), sysutcdatetime());
END;

IF NOT EXISTS (SELECT 1 FROM dbo.AttentionAlerts WHERE AttentionAlertId = '88888888-8888-8888-8888-888888888801')
BEGIN
    INSERT INTO dbo.AttentionAlerts (AttentionAlertId, TenantId, Severity, Title, Description, SuggestedAction, Status, CreatedUtc, UpdatedUtc)
    VALUES
        ('88888888-8888-8888-8888-888888888801', @LumaTenantId, 'critical', 'SharePoint connector degraded', 'Rate-limit backoff has left the care ops library outside freshness target.', 'Review connector quota and resume sync window', 'Open', dateadd(minute, -21, sysutcdatetime()), sysutcdatetime()),
        ('88888888-8888-8888-8888-888888888802', @NovaTenantId, 'warning', 'Outlook Mail sync running behind', 'Mailbox delta is active but currently 24 minutes behind the live queue.', 'Watch ingestion throughput for the next cycle', 'Open', dateadd(minute, -8, sysutcdatetime()), sysutcdatetime()),
        ('88888888-8888-8888-8888-888888888803', @LumaTenantId, 'critical', '3 failed embedding jobs need retry', 'Embedding generation failed after repeated token refresh errors.', 'Retry after Notion auth is refreshed', 'Open', dateadd(minute, -12, sysutcdatetime()), sysutcdatetime()),
        ('88888888-8888-8888-8888-888888888804', @HarbourTenantId, 'warning', 'Tenant has stale index data', 'Matter archive has not completed a freshness sweep today.', 'Queue a targeted knowledge freshness rebuild', 'Open', dateadd(minute, -44, sysutcdatetime()), sysutcdatetime()),
        ('88888888-8888-8888-8888-888888888805', @NovaTenantId, 'info', 'Connector auth token expires soon', 'Google Drive token expires within the next 48 hours.', 'Schedule credential rotation before expiry', 'Open', dateadd(hour, -1, sysutcdatetime()), sysutcdatetime());
END;

IF NOT EXISTS (SELECT 1 FROM dbo.ActivityEvents WHERE ActivityEventId = '77777777-7777-7777-7777-777777777701')
BEGIN
    INSERT INTO dbo.ActivityEvents (ActivityEventId, TenantId, EventType, Description, Status, CreatedUtc)
    VALUES
        ('77777777-7777-7777-7777-777777777701', @LumaTenantId, 'Sync completed', 'SharePoint sync completed for priority care ops folders.', 'Completed', dateadd(minute, -8, sysutcdatetime())),
        ('77777777-7777-7777-7777-777777777702', @NovaTenantId, 'Ingestion started', 'Outlook incremental ingestion entered the processing lane.', 'Running', dateadd(minute, -13, sysutcdatetime())),
        ('77777777-7777-7777-7777-777777777703', @HarbourTenantId, 'Embeddings generated', 'Generated embeddings for 2,140 updated document chunks.', 'Healthy', dateadd(minute, -29, sysutcdatetime())),
        ('77777777-7777-7777-7777-777777777704', @NovaTenantId, 'Question asked', 'User asked for Q2 onboarding blockers with traceable sources.', 'Completed', dateadd(minute, -42, sysutcdatetime())),
        ('77777777-7777-7777-7777-777777777705', @HarbourTenantId, 'Auth refreshed', 'Connector credentials refreshed for Drive corpus.', 'Healthy', dateadd(hour, -1, sysutcdatetime())),
        ('77777777-7777-7777-7777-777777777706', @LumaTenantId, 'OCR retry', 'Failed OCR job retried after worker handoff.', 'Warning', dateadd(hour, -1, sysutcdatetime()));
END;

IF NOT EXISTS (SELECT 1 FROM dbo.DiscoveryFindings WHERE DiscoveryFindingId = '66666666-6666-6666-6666-666666666601')
BEGIN
    INSERT INTO dbo.DiscoveryFindings (DiscoveryFindingId, TenantId, Finding, Severity, Confidence, RecommendedAction, Status, CreatedUtc, UpdatedUtc)
    VALUES
        ('66666666-6666-6666-6666-666666666601', @NovaTenantId, 'Newly discovered systems', 'info', 0.8600, 'Review candidate systems for connector onboarding', 'Open', sysutcdatetime(), sysutcdatetime()),
        ('66666666-6666-6666-6666-666666666602', @LumaTenantId, 'Orphaned mailboxes', 'warning', 0.7900, 'Confirm ownership before including in ingestion policy', 'Open', sysutcdatetime(), sysutcdatetime()),
        ('66666666-6666-6666-6666-666666666603', @HarbourTenantId, 'Inactive licenses', 'info', 0.7400, 'Send candidate list to tenant operations owner', 'Open', sysutcdatetime(), sysutcdatetime()),
        ('66666666-6666-6666-6666-666666666604', @LumaTenantId, 'Unknown SharePoint libraries', 'critical', 0.9100, 'Map libraries to knowledge domains before indexing', 'Open', sysutcdatetime(), sysutcdatetime()),
        ('66666666-6666-6666-6666-666666666605', @NovaTenantId, 'Duplicate documents', 'warning', 0.8300, 'Run duplicate clustering before next rebuild', 'Open', sysutcdatetime(), sysutcdatetime()),
        ('66666666-6666-6666-6666-666666666606', @HarbourTenantId, 'Shadow IT indicators', 'critical', 0.6800, 'Escalate systems list to BobHQ operator review', 'Open', sysutcdatetime(), sysutcdatetime());
END;
