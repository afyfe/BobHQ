using Bob.Api.Domain;

namespace Bob.Api.Repositories;

public interface IConnectorRepository
{
    Task<IReadOnlyList<Connector>> ListAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ConnectorRun>> ListRunsAsync(Guid connectorId, CancellationToken cancellationToken = default);
}
