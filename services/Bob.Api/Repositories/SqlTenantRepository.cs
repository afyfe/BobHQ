using Bob.Api.Data;
using Bob.Api.Domain;
using Dapper;
using Microsoft.Data.SqlClient;

namespace Bob.Api.Repositories;

public sealed class SqlTenantRepository : ITenantRepository
{
    private readonly ISqlConnectionFactory connectionFactory;

    public SqlTenantRepository(ISqlConnectionFactory connectionFactory)
    {
        this.connectionFactory = connectionFactory;
    }

    public async Task<IReadOnlyList<Tenant>> ListAsync(CancellationToken cancellationToken = default)
    {
        const string sql = """
            select
                TenantId,
                Name,
                PlanName,
                Status,
                UserCount,
                ConnectorCount,
                DocumentsIndexed,
                LastActivityUtc,
                CreatedUtc,
                UpdatedUtc
            from dbo.Tenants
            order by Name;
            """;

        using var connection = connectionFactory.CreateConnection();
        var tenants = await connection.QueryAsync<Tenant>(
            new CommandDefinition(sql, cancellationToken: cancellationToken));

        return tenants.AsList();
    }

    public async Task<Tenant?> GetAsync(Guid tenantId, CancellationToken cancellationToken = default)
    {
        const string sql = """
            select
                TenantId,
                Name,
                PlanName,
                Status,
                UserCount,
                ConnectorCount,
                DocumentsIndexed,
                LastActivityUtc,
                CreatedUtc,
                UpdatedUtc
            from dbo.Tenants
            where TenantId = @TenantId;
            """;

        using var connection = connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Tenant>(
            new CommandDefinition(sql, new { TenantId = tenantId }, cancellationToken: cancellationToken));
    }

    public async Task<bool> NameExistsAsync(string name, CancellationToken cancellationToken = default)
    {
        const string sql = """
            select cast(
                case when exists (
                    select 1 from dbo.Tenants where upper(Name) = upper(@Name)
                ) then 1 else 0 end
            as bit);
            """;

        using var connection = connectionFactory.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(sql, new { Name = name }, cancellationToken: cancellationToken));
    }

    public async Task<Tenant> CreateAsync(CreateTenantInput input, CancellationToken cancellationToken = default)
    {
        const string sql = """
            insert into dbo.Tenants (
                TenantId,
                Name,
                PlanName,
                Status,
                UserCount,
                ConnectorCount,
                DocumentsIndexed,
                LastActivityUtc,
                CreatedUtc,
                UpdatedUtc)
            values (
                @TenantId,
                @Name,
                @PlanName,
                @Status,
                @UserCount,
                @ConnectorCount,
                @DocumentsIndexed,
                @LastActivityUtc,
                @CreatedUtc,
                @UpdatedUtc);
            """;

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

        using var connection = connectionFactory.CreateConnection();

        try
        {
            await connection.ExecuteAsync(new CommandDefinition(sql, tenant, cancellationToken: cancellationToken));
        }
        catch (SqlException exception) when (exception.Number is 2601 or 2627)
        {
            throw new DuplicateTenantNameException(input.Name);
        }

        return tenant;
    }
}
