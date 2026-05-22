namespace Bob.Connectors.Models;

public sealed record ConnectorHealthResult(
    Guid ConnectorId,
    string ConnectorName,
    ConnectorType ConnectorType,
    ConnectorStatus Status,
    string Summary,
    DateTimeOffset CheckedUtc,
    IReadOnlyList<string> Warnings,
    IReadOnlyList<string> Errors);
