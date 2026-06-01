using Bob.ConnectorPersistence.Abstractions;
using Bob.ConnectorPersistence.Models;
using Bob.Connectors.Models;

namespace Bob.ConnectorPersistence.Repositories;

public sealed class NullConnectorRunRepository : IConnectorRunWriter, IConnectorRunReader
{
    public Task PersistExecutionAsync(
        ConnectorExecutionResult result,
        CancellationToken cancellationToken = default) => Task.CompletedTask;

    public Task PersistCycleSummaryAsync(
        ConnectorCycleSummary summary,
        CancellationToken cancellationToken = default) => Task.CompletedTask;

    public Task<IReadOnlyList<ConnectorRunRecord>> GetRunsAsync(
        int limit = 100,
        CancellationToken cancellationToken = default) =>
        Task.FromResult<IReadOnlyList<ConnectorRunRecord>>([]);

    public Task<IReadOnlyList<ConnectorHealthRecord>> GetHealthAsync(
        CancellationToken cancellationToken = default) =>
        Task.FromResult<IReadOnlyList<ConnectorHealthRecord>>([]);

    public Task<IReadOnlyList<ConnectorRunRecord>> GetLatestAsync(
        CancellationToken cancellationToken = default) =>
        Task.FromResult<IReadOnlyList<ConnectorRunRecord>>([]);
}
