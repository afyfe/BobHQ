using Bob.Api.Domain;

namespace Bob.Api.Repositories;

public interface IAuditRepository
{
    Task<IReadOnlyList<AuditEntry>> ListAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AuditEntry>> ListByTenantAsync(Guid tenantId, CancellationToken cancellationToken = default);
}
