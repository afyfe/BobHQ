using Bob.Api.Domain;

namespace Bob.Api.Repositories;

public interface IKnowledgeRepository
{
    Task<IReadOnlyList<KnowledgeItem>> ListAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<KnowledgeItem>> ListByTenantAsync(Guid tenantId, CancellationToken cancellationToken = default);
}
