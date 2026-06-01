using Bob.Connectors.Models;
using Bob.ConnectorPersistence.Models;

namespace Bob.ConnectorPersistence.Abstractions;

public interface IConnectorRunWriter
{
    Task PersistExecutionAsync(
        ConnectorExecutionResult result,
        CancellationToken cancellationToken = default);

    Task PersistCycleSummaryAsync(
        ConnectorCycleSummary summary,
        CancellationToken cancellationToken = default);
}
