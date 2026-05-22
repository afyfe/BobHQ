-- BobHQ operational persistence foundation.
-- Runtime still uses MockDashboardDataService; this schema is for the future SQL Server-backed implementation.

CREATE TABLE dbo.Tenants
(
    TenantId uniqueidentifier NOT NULL CONSTRAINT PK_Tenants PRIMARY KEY,
    Name nvarchar(200) NOT NULL,
    PlanName nvarchar(50) NOT NULL,
    Status nvarchar(50) NOT NULL,
    UserCount int NOT NULL CONSTRAINT DF_Tenants_UserCount DEFAULT (0),
    ConnectorCount int NOT NULL CONSTRAINT DF_Tenants_ConnectorCount DEFAULT (0),
    DocumentsIndexed int NOT NULL CONSTRAINT DF_Tenants_DocumentsIndexed DEFAULT (0),
    LastActivityUtc datetime2 NULL,
    CreatedUtc datetime2 NOT NULL CONSTRAINT DF_Tenants_CreatedUtc DEFAULT (sysutcdatetime()),
    UpdatedUtc datetime2 NOT NULL CONSTRAINT DF_Tenants_UpdatedUtc DEFAULT (sysutcdatetime())
);

CREATE TABLE dbo.Users
(
    UserId uniqueidentifier NOT NULL CONSTRAINT PK_Users PRIMARY KEY,
    TenantId uniqueidentifier NULL,
    DisplayName nvarchar(200) NOT NULL,
    Email nvarchar(320) NOT NULL,
    RoleName nvarchar(80) NOT NULL,
    TenantScope nvarchar(200) NOT NULL,
    Status nvarchar(50) NOT NULL,
    LastSeenUtc datetime2 NULL,
    CreatedUtc datetime2 NOT NULL CONSTRAINT DF_Users_CreatedUtc DEFAULT (sysutcdatetime()),
    UpdatedUtc datetime2 NOT NULL CONSTRAINT DF_Users_UpdatedUtc DEFAULT (sysutcdatetime()),
    CONSTRAINT FK_Users_Tenants FOREIGN KEY (TenantId) REFERENCES dbo.Tenants(TenantId)
);

CREATE TABLE dbo.Connectors
(
    ConnectorId uniqueidentifier NOT NULL CONSTRAINT PK_Connectors PRIMARY KEY,
    TenantId uniqueidentifier NOT NULL,
    Name nvarchar(160) NOT NULL,
    Status nvarchar(50) NOT NULL,
    LastSuccessfulSyncUtc datetime2 NULL,
    LastErrorMessage nvarchar(1000) NULL,
    ItemsIndexed int NOT NULL CONSTRAINT DF_Connectors_ItemsIndexed DEFAULT (0),
    IsEnabled bit NOT NULL CONSTRAINT DF_Connectors_IsEnabled DEFAULT (1),
    SyncProgressLabel nvarchar(200) NULL,
    FailureCount int NOT NULL CONSTRAINT DF_Connectors_FailureCount DEFAULT (0),
    CreatedUtc datetime2 NOT NULL CONSTRAINT DF_Connectors_CreatedUtc DEFAULT (sysutcdatetime()),
    UpdatedUtc datetime2 NOT NULL CONSTRAINT DF_Connectors_UpdatedUtc DEFAULT (sysutcdatetime()),
    CONSTRAINT FK_Connectors_Tenants FOREIGN KEY (TenantId) REFERENCES dbo.Tenants(TenantId)
);

CREATE TABLE dbo.ConnectorRuns
(
    ConnectorRunId uniqueidentifier NOT NULL CONSTRAINT PK_ConnectorRuns PRIMARY KEY,
    ConnectorId uniqueidentifier NOT NULL,
    TenantId uniqueidentifier NOT NULL,
    Status nvarchar(50) NOT NULL,
    ProgressText nvarchar(200) NULL,
    StartedUtc datetime2 NOT NULL,
    CompletedUtc datetime2 NULL,
    FailureCount int NOT NULL CONSTRAINT DF_ConnectorRuns_FailureCount DEFAULT (0),
    ErrorMessage nvarchar(1000) NULL,
    CreatedUtc datetime2 NOT NULL CONSTRAINT DF_ConnectorRuns_CreatedUtc DEFAULT (sysutcdatetime()),
    UpdatedUtc datetime2 NOT NULL CONSTRAINT DF_ConnectorRuns_UpdatedUtc DEFAULT (sysutcdatetime()),
    CONSTRAINT FK_ConnectorRuns_Connectors FOREIGN KEY (ConnectorId) REFERENCES dbo.Connectors(ConnectorId),
    CONSTRAINT FK_ConnectorRuns_Tenants FOREIGN KEY (TenantId) REFERENCES dbo.Tenants(TenantId)
);

CREATE TABLE dbo.Jobs
(
    JobId uniqueidentifier NOT NULL CONSTRAINT PK_Jobs PRIMARY KEY,
    TenantId uniqueidentifier NOT NULL,
    JobType nvarchar(160) NOT NULL,
    Status nvarchar(50) NOT NULL,
    RetryCount int NOT NULL CONSTRAINT DF_Jobs_RetryCount DEFAULT (0),
    CreatedUtc datetime2 NOT NULL CONSTRAINT DF_Jobs_CreatedUtc DEFAULT (sysutcdatetime()),
    CompletedUtc datetime2 NULL,
    FailureMessage nvarchar(1000) NULL,
    UpdatedUtc datetime2 NOT NULL CONSTRAINT DF_Jobs_UpdatedUtc DEFAULT (sysutcdatetime()),
    CONSTRAINT FK_Jobs_Tenants FOREIGN KEY (TenantId) REFERENCES dbo.Tenants(TenantId)
);

CREATE TABLE dbo.KnowledgeItems
(
    KnowledgeItemId uniqueidentifier NOT NULL CONSTRAINT PK_KnowledgeItems PRIMARY KEY,
    TenantId uniqueidentifier NOT NULL,
    SourceName nvarchar(200) NOT NULL,
    Status nvarchar(50) NOT NULL,
    DocumentCount int NOT NULL CONSTRAINT DF_KnowledgeItems_DocumentCount DEFAULT (0),
    EmailCount int NOT NULL CONSTRAINT DF_KnowledgeItems_EmailCount DEFAULT (0),
    FreshnessUtc datetime2 NULL,
    CreatedUtc datetime2 NOT NULL CONSTRAINT DF_KnowledgeItems_CreatedUtc DEFAULT (sysutcdatetime()),
    UpdatedUtc datetime2 NOT NULL CONSTRAINT DF_KnowledgeItems_UpdatedUtc DEFAULT (sysutcdatetime()),
    CONSTRAINT FK_KnowledgeItems_Tenants FOREIGN KEY (TenantId) REFERENCES dbo.Tenants(TenantId)
);

CREATE TABLE dbo.AuditEntries
(
    AuditEntryId uniqueidentifier NOT NULL CONSTRAINT PK_AuditEntries PRIMARY KEY,
    TenantId uniqueidentifier NOT NULL,
    UserId uniqueidentifier NULL,
    Question nvarchar(1000) NOT NULL,
    UserEmail nvarchar(320) NOT NULL,
    Confidence decimal(5,4) NOT NULL,
    SourceCount int NOT NULL CONSTRAINT DF_AuditEntries_SourceCount DEFAULT (0),
    Status nvarchar(50) NOT NULL,
    ExplainabilityStatus nvarchar(80) NOT NULL,
    CreatedUtc datetime2 NOT NULL CONSTRAINT DF_AuditEntries_CreatedUtc DEFAULT (sysutcdatetime()),
    UpdatedUtc datetime2 NOT NULL CONSTRAINT DF_AuditEntries_UpdatedUtc DEFAULT (sysutcdatetime()),
    CONSTRAINT FK_AuditEntries_Tenants FOREIGN KEY (TenantId) REFERENCES dbo.Tenants(TenantId),
    CONSTRAINT FK_AuditEntries_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
);

CREATE TABLE dbo.AttentionAlerts
(
    AttentionAlertId uniqueidentifier NOT NULL CONSTRAINT PK_AttentionAlerts PRIMARY KEY,
    TenantId uniqueidentifier NOT NULL,
    Severity nvarchar(50) NOT NULL,
    Title nvarchar(200) NOT NULL,
    Description nvarchar(1000) NOT NULL,
    SuggestedAction nvarchar(500) NOT NULL,
    Status nvarchar(50) NOT NULL CONSTRAINT DF_AttentionAlerts_Status DEFAULT ('Open'),
    CreatedUtc datetime2 NOT NULL CONSTRAINT DF_AttentionAlerts_CreatedUtc DEFAULT (sysutcdatetime()),
    UpdatedUtc datetime2 NOT NULL CONSTRAINT DF_AttentionAlerts_UpdatedUtc DEFAULT (sysutcdatetime()),
    CONSTRAINT FK_AttentionAlerts_Tenants FOREIGN KEY (TenantId) REFERENCES dbo.Tenants(TenantId)
);

CREATE TABLE dbo.ActivityEvents
(
    ActivityEventId uniqueidentifier NOT NULL CONSTRAINT PK_ActivityEvents PRIMARY KEY,
    TenantId uniqueidentifier NOT NULL,
    EventType nvarchar(120) NOT NULL,
    Description nvarchar(1000) NOT NULL,
    Status nvarchar(50) NOT NULL,
    CreatedUtc datetime2 NOT NULL CONSTRAINT DF_ActivityEvents_CreatedUtc DEFAULT (sysutcdatetime()),
    CONSTRAINT FK_ActivityEvents_Tenants FOREIGN KEY (TenantId) REFERENCES dbo.Tenants(TenantId)
);

CREATE TABLE dbo.DiscoveryFindings
(
    DiscoveryFindingId uniqueidentifier NOT NULL CONSTRAINT PK_DiscoveryFindings PRIMARY KEY,
    TenantId uniqueidentifier NOT NULL,
    Finding nvarchar(200) NOT NULL,
    Severity nvarchar(50) NOT NULL,
    Confidence decimal(5,4) NOT NULL,
    RecommendedAction nvarchar(500) NOT NULL,
    Status nvarchar(50) NOT NULL CONSTRAINT DF_DiscoveryFindings_Status DEFAULT ('Open'),
    CreatedUtc datetime2 NOT NULL CONSTRAINT DF_DiscoveryFindings_CreatedUtc DEFAULT (sysutcdatetime()),
    UpdatedUtc datetime2 NOT NULL CONSTRAINT DF_DiscoveryFindings_UpdatedUtc DEFAULT (sysutcdatetime()),
    CONSTRAINT FK_DiscoveryFindings_Tenants FOREIGN KEY (TenantId) REFERENCES dbo.Tenants(TenantId)
);

CREATE UNIQUE INDEX UX_Users_Email ON dbo.Users(Email);
CREATE INDEX IX_Tenants_Status ON dbo.Tenants(Status);
CREATE INDEX IX_Tenants_CreatedUtc ON dbo.Tenants(CreatedUtc);

CREATE INDEX IX_Users_TenantId ON dbo.Users(TenantId);
CREATE INDEX IX_Users_Status ON dbo.Users(Status);
CREATE INDEX IX_Users_CreatedUtc ON dbo.Users(CreatedUtc);

CREATE INDEX IX_Connectors_TenantId ON dbo.Connectors(TenantId);
CREATE INDEX IX_Connectors_Status ON dbo.Connectors(Status);
CREATE INDEX IX_Connectors_CreatedUtc ON dbo.Connectors(CreatedUtc);

CREATE INDEX IX_ConnectorRuns_TenantId ON dbo.ConnectorRuns(TenantId);
CREATE INDEX IX_ConnectorRuns_ConnectorId ON dbo.ConnectorRuns(ConnectorId);
CREATE INDEX IX_ConnectorRuns_Status ON dbo.ConnectorRuns(Status);
CREATE INDEX IX_ConnectorRuns_CreatedUtc ON dbo.ConnectorRuns(CreatedUtc);

CREATE INDEX IX_Jobs_TenantId ON dbo.Jobs(TenantId);
CREATE INDEX IX_Jobs_Status ON dbo.Jobs(Status);
CREATE INDEX IX_Jobs_CreatedUtc ON dbo.Jobs(CreatedUtc);

CREATE INDEX IX_KnowledgeItems_TenantId ON dbo.KnowledgeItems(TenantId);
CREATE INDEX IX_KnowledgeItems_Status ON dbo.KnowledgeItems(Status);
CREATE INDEX IX_KnowledgeItems_CreatedUtc ON dbo.KnowledgeItems(CreatedUtc);

CREATE INDEX IX_AuditEntries_TenantId ON dbo.AuditEntries(TenantId);
CREATE INDEX IX_AuditEntries_Status ON dbo.AuditEntries(Status);
CREATE INDEX IX_AuditEntries_CreatedUtc ON dbo.AuditEntries(CreatedUtc);

CREATE INDEX IX_AttentionAlerts_TenantId ON dbo.AttentionAlerts(TenantId);
CREATE INDEX IX_AttentionAlerts_Status ON dbo.AttentionAlerts(Status);
CREATE INDEX IX_AttentionAlerts_CreatedUtc ON dbo.AttentionAlerts(CreatedUtc);

CREATE INDEX IX_ActivityEvents_TenantId ON dbo.ActivityEvents(TenantId);
CREATE INDEX IX_ActivityEvents_Status ON dbo.ActivityEvents(Status);
CREATE INDEX IX_ActivityEvents_CreatedUtc ON dbo.ActivityEvents(CreatedUtc);

CREATE INDEX IX_DiscoveryFindings_TenantId ON dbo.DiscoveryFindings(TenantId);
CREATE INDEX IX_DiscoveryFindings_Status ON dbo.DiscoveryFindings(Status);
CREATE INDEX IX_DiscoveryFindings_CreatedUtc ON dbo.DiscoveryFindings(CreatedUtc);
