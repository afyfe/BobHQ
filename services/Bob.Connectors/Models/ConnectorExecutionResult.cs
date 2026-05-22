namespace Bob.Connectors.Models;

public sealed record ConnectorExecutionResult(
    Guid ConnectorId,
    string ConnectorName,
    ConnectorType ConnectorType,
    Guid TenantId,
    string TenantName,
    ConnectorStatus Status,
    DateTimeOffset StartedUtc,
    DateTimeOffset CompletedUtc,
    TimeSpan Duration,
    IReadOnlyList<ConnectorItem> Items,
    IReadOnlyList<string> Warnings,
    IReadOnlyList<string> Errors,
    ConnectorExecutionLog Log);
