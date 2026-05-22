using Bob.Api.Domain;

namespace Bob.Api.Repositories;

public interface IDiscoveryRepository
{
    Task<IReadOnlyList<DiscoveryFinding>> ListAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<DiscoveryFinding>> ListOpenAsync(CancellationToken cancellationToken = default);
}
