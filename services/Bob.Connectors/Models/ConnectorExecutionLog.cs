namespace Bob.Connectors.Models;

public sealed record ConnectorExecutionLog(
    string Connector,
    string Tenant,
    DateTimeOffset StartedUtc,
    DateTimeOffset CompletedUtc,
    TimeSpan Duration,
    ConnectorStatus Status,
    int ItemsProcessed,
    IReadOnlyList<string> Warnings,
    IReadOnlyList<string> Errors,
    IReadOnlyList<string> Messages);
