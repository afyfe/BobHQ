using Bob.Connectors.Models;

namespace Bob.Connectors.Abstractions;

public interface IConnectorRuntime
{
    IReadOnlyList<IConnector> Connectors { get; }

    Task<IReadOnlyList<ConnectorExecutionResult>> ExecuteEnabledConnectorsAsync(
        Guid tenantId,
        string tenantName,
        ConnectorSyncMode syncMode,
        CancellationToken cancellationToken = default);

    Task<ConnectorExecutionResult> ExecuteConnectorAsync(
        IConnector connector,
        Guid tenantId,
        string tenantName,
        ConnectorSyncMode syncMode,
        CancellationToken cancellationToken = default);
}
