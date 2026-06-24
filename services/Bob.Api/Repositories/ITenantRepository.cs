using Bob.Api.Domain;

namespace Bob.Api.Repositories;

public interface ITenantRepository
{
    Task<IReadOnlyList<Tenant>> ListAsync(CancellationToken cancellationToken = default);
    Task<Tenant?> GetAsync(Guid tenantId, CancellationToken cancellationToken = default);
    Task<bool> NameExistsAsync(string name, CancellationToken cancellationToken = default);
    Task<Tenant> CreateAsync(CreateTenantInput input, CancellationToken cancellationToken = default);
}

public sealed record CreateTenantInput(
    string Name,
    string PlanName,
    string Status);

public sealed class DuplicateTenantNameException : Exception
{
    public DuplicateTenantNameException(string name)
        : base($"Tenant name '{name}' already exists.")
    {
        Name = name;
    }

    public string Name { get; }
}
