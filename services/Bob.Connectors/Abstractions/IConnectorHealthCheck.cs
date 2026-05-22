using Bob.Connectors.Models;

namespace Bob.Connectors.Abstractions;

public interface IConnectorHealthCheck
{
    Task<ConnectorHealthResult> CheckHealthAsync(
        ConnectorExecutionContext context,
        CancellationToken cancellationToken = default);
}
