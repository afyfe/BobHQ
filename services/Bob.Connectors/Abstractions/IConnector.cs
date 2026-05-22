using Bob.Connectors.Models;

namespace Bob.Connectors.Abstractions;

public interface IConnector
{
    Guid ConnectorId { get; }

    string Name { get; }

    ConnectorType Type { get; }

    bool IsEnabled { get; }

    Task<ConnectorExecutionResult> ExecuteAsync(
        ConnectorExecutionContext context,
        CancellationToken cancellationToken = default);
}
