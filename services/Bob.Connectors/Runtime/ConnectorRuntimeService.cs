using Bob.Connectors.Abstractions;
using Bob.Connectors.Models;

namespace Bob.Connectors.Runtime;

public sealed class ConnectorRuntimeService : IConnectorRuntime
{
    public ConnectorRuntimeService(IEnumerable<IConnector> connectors)
    {
        Connectors = connectors.ToArray();
    }

    public IReadOnlyList<IConnector> Connectors { get; }

    public async Task<IReadOnlyList<ConnectorExecutionResult>> ExecuteEnabledConnectorsAsync(
        Guid tenantId,
        string tenantName,
        ConnectorSyncMode syncMode,
        CancellationToken cancellationToken = default)
    {
        var results = new List<ConnectorExecutionResult>();

        foreach (var connector in Connectors.Where(connector => connector.IsEnabled))
        {
            cancellationToken.ThrowIfCancellationRequested();
            results.Add(await ExecuteConnectorAsync(connector, tenantId, tenantName, syncMode, cancellationToken));
        }

        return results;
    }

    public Task<ConnectorExecutionResult> ExecuteConnectorAsync(
        IConnector connector,
        Guid tenantId,
        string tenantName,
        ConnectorSyncMode syncMode,
        CancellationToken cancellationToken = default)
    {
        var context = new ConnectorExecutionContext(
            tenantId,
            tenantName,
            connector.ConnectorId,
            connector.Name,
            connector.Type,
            syncMode,
            DateTimeOffset.UtcNow);

        return connector.ExecuteAsync(context, cancellationToken);
    }
}
