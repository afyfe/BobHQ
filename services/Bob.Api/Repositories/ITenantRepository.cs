using Bob.Api.Domain;

namespace Bob.Api.Repositories;

public interface ITenantRepository
{
    Task<IReadOnlyList<Tenant>> ListAsync(CancellationToken cancellationToken = default);
    Task<Tenant?> GetAsync(Guid tenantId, CancellationToken cancellationToken = default);
}
