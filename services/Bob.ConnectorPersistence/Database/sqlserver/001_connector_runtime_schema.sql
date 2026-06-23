-- SQL Server connector telemetry schema.
-- Safe to re-run during local bootstrap.

if not exists (select 1 from sys.tables where name = 'ConnectorRuns' and schema_id = schema_id('dbo'))
begin
    create table dbo.ConnectorRuns
    (
        ConnectorRunId uniqueidentifier not null constraint PK_ConnectorRuns primary key,
        ConnectorId uniqueidentifier not null,
        TenantId uniqueidentifier not null,
        TenantName nvarchar(200) not null,
        ConnectorName nvarchar(200) not null,
        ConnectorType nvarchar(100) not null,
        Status nvarchar(50) not null,
        StartedUtc datetimeoffset not null,
        CompletedUtc datetimeoffset not null,
        DurationMilliseconds bigint not null,
        ItemsProcessed int not null,
        WarningCount int not null,
        ErrorCount int not null,
        CreatedUtc datetimeoffset not null constraint DF_ConnectorRuns_CreatedUtc default (sysutcdatetime())
    );
end;

if not exists (select 1 from sys.tables where name = 'ConnectorRunLogs' and schema_id = schema_id('dbo'))
begin
    create table dbo.ConnectorRunLogs
    (
        ConnectorRunLogId uniqueidentifier not null constraint PK_ConnectorRunLogs primary key,
        ConnectorRunId uniqueidentifier not null,
        Level nvarchar(50) not null,
        Message nvarchar(max) not null,
        CreatedUtc datetimeoffset not null constraint DF_ConnectorRunLogs_CreatedUtc default (sysutcdatetime()),
        constraint FK_ConnectorRunLogs_ConnectorRuns foreign key (ConnectorRunId)
            references dbo.ConnectorRuns(ConnectorRunId) on delete cascade
    );
end;

if not exists (select 1 from sys.tables where name = 'ConnectorWarnings' and schema_id = schema_id('dbo'))
begin
    create table dbo.ConnectorWarnings
    (
        ConnectorWarningId uniqueidentifier not null constraint PK_ConnectorWarnings primary key,
        ConnectorRunId uniqueidentifier not null,
        Severity nvarchar(50) not null,
        Message nvarchar(max) not null,
        CreatedUtc datetimeoffset not null constraint DF_ConnectorWarnings_CreatedUtc default (sysutcdatetime()),
        constraint FK_ConnectorWarnings_ConnectorRuns foreign key (ConnectorRunId)
            references dbo.ConnectorRuns(ConnectorRunId) on delete cascade
    );
end;

if not exists (select 1 from sys.tables where name = 'ConnectorCycleSummaries' and schema_id = schema_id('dbo'))
begin
    create table dbo.ConnectorCycleSummaries
    (
        ConnectorCycleSummaryId uniqueidentifier not null constraint PK_ConnectorCycleSummaries primary key,
        TenantId uniqueidentifier not null,
        TenantName nvarchar(200) not null,
        StartedUtc datetimeoffset not null,
        CompletedUtc datetimeoffset not null,
        ConnectorCount int not null,
        ItemsProcessed int not null,
        FailedCount int not null,
        DegradedCount int not null,
        CreatedUtc datetimeoffset not null constraint DF_ConnectorCycleSummaries_CreatedUtc default (sysutcdatetime())
    );
end;

if not exists (select 1 from sys.indexes where name = 'IX_ConnectorRuns_ConnectorId')
    create index IX_ConnectorRuns_ConnectorId on dbo.ConnectorRuns(ConnectorId);

if not exists (select 1 from sys.indexes where name = 'IX_ConnectorRuns_TenantId')
    create index IX_ConnectorRuns_TenantId on dbo.ConnectorRuns(TenantId);

if not exists (select 1 from sys.indexes where name = 'IX_ConnectorRuns_Status')
    create index IX_ConnectorRuns_Status on dbo.ConnectorRuns(Status);

if not exists (select 1 from sys.indexes where name = 'IX_ConnectorRuns_StartedUtc')
    create index IX_ConnectorRuns_StartedUtc on dbo.ConnectorRuns(StartedUtc desc);

if not exists (select 1 from sys.indexes where name = 'IX_ConnectorRunLogs_ConnectorRunId')
    create index IX_ConnectorRunLogs_ConnectorRunId on dbo.ConnectorRunLogs(ConnectorRunId);

if not exists (select 1 from sys.indexes where name = 'IX_ConnectorWarnings_ConnectorRunId')
    create index IX_ConnectorWarnings_ConnectorRunId on dbo.ConnectorWarnings(ConnectorRunId);

if not exists (select 1 from sys.indexes where name = 'IX_ConnectorCycleSummaries_TenantId')
    create index IX_ConnectorCycleSummaries_TenantId on dbo.ConnectorCycleSummaries(TenantId);

if not exists (select 1 from sys.indexes where name = 'IX_ConnectorCycleSummaries_StartedUtc')
    create index IX_ConnectorCycleSummaries_StartedUtc on dbo.ConnectorCycleSummaries(StartedUtc desc);
