-- PostgreSQL connector telemetry schema.
-- Safe to re-run during local bootstrap. This does not alter Bob.Api dashboard tables.

create table if not exists "ConnectorRuns"
(
    "ConnectorRunId" uuid primary key,
    "ConnectorId" uuid not null,
    "TenantId" uuid not null,
    "TenantName" text not null,
    "ConnectorName" text not null,
    "ConnectorType" text not null,
    "Status" text not null,
    "StartedUtc" timestamptz not null,
    "CompletedUtc" timestamptz not null,
    "DurationMilliseconds" bigint not null,
    "ItemsProcessed" integer not null,
    "WarningCount" integer not null,
    "ErrorCount" integer not null,
    "CreatedUtc" timestamptz not null default now()
);

create table if not exists "ConnectorRunLogs"
(
    "ConnectorRunLogId" uuid primary key,
    "ConnectorRunId" uuid not null references "ConnectorRuns" ("ConnectorRunId") on delete cascade,
    "Level" text not null,
    "Message" text not null,
    "CreatedUtc" timestamptz not null default now()
);

create table if not exists "ConnectorWarnings"
(
    "ConnectorWarningId" uuid primary key,
    "ConnectorRunId" uuid not null references "ConnectorRuns" ("ConnectorRunId") on delete cascade,
    "Severity" text not null,
    "Message" text not null,
    "CreatedUtc" timestamptz not null default now()
);

create table if not exists "ConnectorCycleSummaries"
(
    "ConnectorCycleSummaryId" uuid primary key,
    "TenantId" uuid not null,
    "TenantName" text not null,
    "StartedUtc" timestamptz not null,
    "CompletedUtc" timestamptz not null,
    "ConnectorCount" integer not null,
    "ItemsProcessed" integer not null,
    "FailedCount" integer not null,
    "DegradedCount" integer not null,
    "CreatedUtc" timestamptz not null default now()
);

create index if not exists "IX_ConnectorRuns_ConnectorId" on "ConnectorRuns" ("ConnectorId");
create index if not exists "IX_ConnectorRuns_TenantId" on "ConnectorRuns" ("TenantId");
create index if not exists "IX_ConnectorRuns_Status" on "ConnectorRuns" ("Status");
create index if not exists "IX_ConnectorRuns_StartedUtc" on "ConnectorRuns" ("StartedUtc" desc);
create index if not exists "IX_ConnectorRunLogs_ConnectorRunId" on "ConnectorRunLogs" ("ConnectorRunId");
create index if not exists "IX_ConnectorWarnings_ConnectorRunId" on "ConnectorWarnings" ("ConnectorRunId");
create index if not exists "IX_ConnectorCycleSummaries_TenantId" on "ConnectorCycleSummaries" ("TenantId");
create index if not exists "IX_ConnectorCycleSummaries_StartedUtc" on "ConnectorCycleSummaries" ("StartedUtc" desc);
