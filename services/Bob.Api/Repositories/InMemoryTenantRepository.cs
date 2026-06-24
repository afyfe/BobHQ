using Bob.Api.Domain;

namespace Bob.Api.Repositories;

public sealed class InMemoryTenantRepository : ITenantRepository
{
    private readonly object gate = new();
    private readonly List<Tenant> tenants =
    [
        new(
            TenantId: Guid.Parse("44444444-4444-4444-4444-444444444444"),
            Name: "Northwind Legal",
            PlanName: "Internal Preview",
            Status: "Active",
            UserCount: 0,
            ConnectorCount: 0,
            DocumentsIndexed: 0,
            LastActivityUtc: null,
            CreatedUtc: DateTime.UtcNow,
            UpdatedUtc: DateTime.UtcNow)
    ];

    public Task<IReadOnlyList<Tenant>> ListAsync(CancellationToken cancellationToken = default)
    {
        lock (gate)
        {
            return Task.FromResult<IReadOnlyList<Tenant>>([.. tenants.OrderBy(tenant => tenant.Name)]);
        }
    }

    public Task<Tenant?> GetAsync(Guid tenantId, CancellationToken cancellationToken = default)
    {
        lock (gate)
        {
            return Task.FromResult(tenants.FirstOrDefault(tenant => tenant.TenantId == tenantId));
        }
    }

    public Task<bool> NameExistsAsync(string name, CancellationToken cancellationToken = default)
    {
        lock (gate)
        {
            return Task.FromResult(tenants.Any(tenant =>
                string.Equals(tenant.Name, name, StringComparison.OrdinalIgnoreCase)));
        }
    }

    public Task<Tenant> CreateAsync(CreateTenantInput input, CancellationToken cancellationToken = default)
    {
        lock (gate)
        {
            if (tenants.Any(tenant => string.Equals(tenant.Name, input.Name, StringComparison.OrdinalIgnoreCase)))
            {
                throw new DuplicateTenantNameException(input.Name);
            }

            var now = DateTime.UtcNow;
            var tenant = new Tenant(
                TenantId: Guid.NewGuid(),
                Name: input.Name,
                PlanName: input.PlanName,
                Status: input.Status,
                UserCount: 0,
                ConnectorCount: 0,
                DocumentsIndexed: 0,
                LastActivityUtc: null,
                CreatedUtc: now,
                UpdatedUtc: now);

            tenants.Add(tenant);
            return Task.FromResult(tenant);
        }
    }
}
