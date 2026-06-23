using Bob.ConnectorPersistence.Abstractions;
using Bob.ConnectorPersistence.Data;
using Bob.ConnectorPersistence.Models;
using Bob.Connectors.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Bob.ConnectorPersistence.Repositories;

public sealed class SqlServerConnectorRunRepository : IConnectorRunWriter, IConnectorRunReader
{
    private readonly ISqlServerConnectionFactory connectionFactory;

    public SqlServerConnectorRunRepository(ISqlServerConnectionFactory connectionFactory)
    {
        this.connectionFactory = connectionFactory;
    }

    public async Task PersistExecutionAsync(
        ConnectorExecutionResult result,
        CancellationToken cancellationToken = default)
    {
        const string insertRunSql = """
            insert into dbo.ConnectorRuns (
                ConnectorRunId, ConnectorId, TenantId, TenantName, ConnectorName,
                ConnectorType, Status, StartedUtc, CompletedUtc, DurationMilliseconds,
                ItemsProcessed, WarningCount, ErrorCount, CreatedUtc)
            values (
                @ConnectorRunId, @ConnectorId, @TenantId, @TenantName, @ConnectorName,
                @ConnectorType, @Status, @StartedUtc, @CompletedUtc, @DurationMilliseconds,
                @ItemsProcessed, @WarningCount, @ErrorCount, @CreatedUtc);
            """;

        const string insertLogSql = """
            insert into dbo.ConnectorRunLogs (
                ConnectorRunLogId, ConnectorRunId, Level, Message, CreatedUtc)
            values (@ConnectorRunLogId, @ConnectorRunId, @Level, @Message, @CreatedUtc);
            """;

        var connectorRunId = Guid.NewGuid();

        await using var connection = connectionFactory.CreateConnection();
        await connection.OpenAsync(cancellationToken);
        await using var transaction = await connection.BeginTransactionAsync(cancellationToken);

        await connection.ExecuteAsync(new CommandDefinition(
            insertRunSql,
            new
            {
                ConnectorRunId = connectorRunId,
                result.ConnectorId,
                result.TenantId,
                result.TenantName,
                result.ConnectorName,
                ConnectorType = result.ConnectorType.ToString(),
                Status = result.Status.ToString(),
                result.StartedUtc,
                result.CompletedUtc,
                DurationMilliseconds = (long)Math.Round(result.Duration.TotalMilliseconds),
                ItemsProcessed = result.Items.Count,
                WarningCount = result.Warnings.Count,
                ErrorCount = result.Errors.Count,
                CreatedUtc = DateTimeOffset.UtcNow
            },
            transaction,
            cancellationToken: cancellationToken));

        foreach (var message in result.Log.Messages)
        {
            await connection.ExecuteAsync(new CommandDefinition(
                insertLogSql,
                new
                {
                    ConnectorRunLogId = Guid.NewGuid(),
                    ConnectorRunId = connectorRunId,
                    Level = "Information",
                    Message = message,
                    CreatedUtc = DateTimeOffset.UtcNow
                },
                transaction,
                cancellationToken: cancellationToken));
        }

        foreach (var warning in result.Warnings)
        {
            await PersistWarningAsync(connection, transaction, connectorRunId, "Warning", warning, cancellationToken);
        }

        foreach (var error in result.Errors)
        {
            await PersistWarningAsync(connection, transaction, connectorRunId, "Error", error, cancellationToken);
        }

        await transaction.CommitAsync(cancellationToken);
    }

    public async Task PersistCycleSummaryAsync(
        ConnectorCycleSummary summary,
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            insert into dbo.ConnectorCycleSummaries (
                ConnectorCycleSummaryId, TenantId, TenantName, StartedUtc, CompletedUtc,
                ConnectorCount, ItemsProcessed, FailedCount, DegradedCount, CreatedUtc)
            values (
                @ConnectorCycleSummaryId, @TenantId, @TenantName, @StartedUtc, @CompletedUtc,
                @ConnectorCount, @ItemsProcessed, @FailedCount, @DegradedCount, @CreatedUtc);
            """;

        await using var connection = connectionFactory.CreateConnection();
        await connection.OpenAsync(cancellationToken);
        await connection.ExecuteAsync(new CommandDefinition(
            sql,
            new
            {
                summary.ConnectorCycleSummaryId,
                summary.TenantId,
                summary.TenantName,
                summary.StartedUtc,
                summary.CompletedUtc,
                summary.ConnectorCount,
                summary.ItemsProcessed,
                summary.FailedCount,
                summary.DegradedCount,
                CreatedUtc = DateTimeOffset.UtcNow
            },
            cancellationToken: cancellationToken));
    }

    public async Task<IReadOnlyList<ConnectorRunRecord>> GetRunsAsync(
        int limit = 100,
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            select top (@Limit)
                ConnectorRunId, ConnectorId, TenantId, TenantName, ConnectorName,
                ConnectorType, Status, StartedUtc, CompletedUtc, DurationMilliseconds,
                ItemsProcessed, WarningCount, ErrorCount
            from dbo.ConnectorRuns
            order by StartedUtc desc;
            """;

        await using var connection = connectionFactory.CreateConnection();
        await connection.OpenAsync(cancellationToken);
        var records = await connection.QueryAsync<ConnectorRunRecord>(new CommandDefinition(
            sql,
            new { Limit = Math.Clamp(limit, 1, 500) },
            cancellationToken: cancellationToken));

        return records.AsList();
    }

    public async Task<IReadOnlyList<ConnectorHealthRecord>> GetHealthAsync(
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            with LatestRuns as
            (
                select
                    ConnectorId, TenantId, TenantName, ConnectorName, ConnectorType,
                    Status, CompletedUtc, ItemsProcessed, WarningCount, ErrorCount,
                    row_number() over (partition by ConnectorId order by StartedUtc desc) as RowNumber
                from dbo.ConnectorRuns
            )
            select
                ConnectorId, TenantId, TenantName, ConnectorName, ConnectorType,
                Status, CompletedUtc as LastRunCompletedUtc, ItemsProcessed,
                WarningCount, ErrorCount
            from LatestRuns
            where RowNumber = 1
            order by ConnectorName;
            """;

        await using var connection = connectionFactory.CreateConnection();
        await connection.OpenAsync(cancellationToken);
        var records = await connection.QueryAsync<ConnectorHealthRecord>(
            new CommandDefinition(sql, cancellationToken: cancellationToken));

        return records.AsList();
    }

    public async Task<IReadOnlyList<ConnectorRunRecord>> GetLatestAsync(
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            with LatestRuns as
            (
                select
                    ConnectorRunId, ConnectorId, TenantId, TenantName, ConnectorName,
                    ConnectorType, Status, StartedUtc, CompletedUtc, DurationMilliseconds,
                    ItemsProcessed, WarningCount, ErrorCount,
                    row_number() over (partition by ConnectorId order by StartedUtc desc) as RowNumber
                from dbo.ConnectorRuns
            )
            select
                ConnectorRunId, ConnectorId, TenantId, TenantName, ConnectorName,
                ConnectorType, Status, StartedUtc, CompletedUtc, DurationMilliseconds,
                ItemsProcessed, WarningCount, ErrorCount
            from LatestRuns
            where RowNumber = 1
            order by ConnectorName;
            """;

        await using var connection = connectionFactory.CreateConnection();
        await connection.OpenAsync(cancellationToken);
        var records = await connection.QueryAsync<ConnectorRunRecord>(
            new CommandDefinition(sql, cancellationToken: cancellationToken));

        return records.AsList();
    }

    private static Task PersistWarningAsync(
        SqlConnection connection,
        IDbTransaction transaction,
        Guid connectorRunId,
        string severity,
        string message,
        CancellationToken cancellationToken)
    {
        const string sql = """
            insert into dbo.ConnectorWarnings (
                ConnectorWarningId, ConnectorRunId, Severity, Message, CreatedUtc)
            values (@ConnectorWarningId, @ConnectorRunId, @Severity, @Message, @CreatedUtc);
            """;

        return connection.ExecuteAsync(new CommandDefinition(
            sql,
            new
            {
                ConnectorWarningId = Guid.NewGuid(),
                ConnectorRunId = connectorRunId,
                Severity = severity,
                Message = message,
                CreatedUtc = DateTimeOffset.UtcNow
            },
            transaction,
            cancellationToken: cancellationToken));
    }
}
