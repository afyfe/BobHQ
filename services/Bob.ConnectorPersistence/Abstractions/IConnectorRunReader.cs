using Bob.ConnectorPersistence.Models;

namespace Bob.ConnectorPersistence.Abstractions;

public interface IConnectorRunReader
{
    Task<IReadOnlyList<ConnectorRunRecord>> GetRunsAsync(
        int limit = 100,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ConnectorHealthRecord>> GetHealthAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ConnectorRunRecord>> GetLatestAsync(
        CancellationToken cancellationToken = default);
}
