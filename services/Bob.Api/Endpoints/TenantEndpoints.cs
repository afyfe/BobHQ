using Bob.Api.Domain;
using Bob.Api.Models;
using Bob.Api.Repositories;

namespace Bob.Api.Endpoints;

public static class TenantEndpoints
{
    private const string DefaultPlanName = "Internal Preview";
    private const string DefaultStatus = "Active";

    public static IEndpointRouteBuilder MapTenantEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/tenants");

        group.MapGet("", async (
            ITenantRepository tenants,
            CancellationToken cancellationToken) =>
        {
            var results = await tenants.ListAsync(cancellationToken);
            return Results.Ok(results.Select(MapTenant));
        });

        group.MapGet("/{tenantId:guid}", async (
            Guid tenantId,
            ITenantRepository tenants,
            CancellationToken cancellationToken) =>
        {
            var tenant = await tenants.GetAsync(tenantId, cancellationToken);

            return tenant is null
                ? Results.NotFound(new TenantErrorDto(
                    "tenant_not_found",
                    $"Tenant '{tenantId}' was not found."))
                : Results.Ok(MapTenant(tenant));
        });

        group.MapPost("", async (
            TenantCreateRequest? request,
            ITenantRepository tenants,
            CancellationToken cancellationToken) =>
        {
            var name = request?.Name?.Trim() ?? string.Empty;

            if (string.IsNullOrWhiteSpace(name))
            {
                return Results.BadRequest(new TenantErrorDto(
                    "tenant_name_required",
                    "Tenant name is required.",
                    "name"));
            }

            var planName = string.IsNullOrWhiteSpace(request?.PlanName)
                ? DefaultPlanName
                : request.PlanName.Trim();

            if (await tenants.NameExistsAsync(name, cancellationToken))
            {
                return Results.Conflict(new TenantErrorDto(
                    "tenant_name_conflict",
                    $"Tenant name '{name}' already exists.",
                    "name"));
            }

            try
            {
                var tenant = await tenants.CreateAsync(
                    new CreateTenantInput(name, planName, DefaultStatus),
                    cancellationToken);

                return Results.Created($"/api/tenants/{tenant.TenantId}", MapTenant(tenant));
            }
            catch (DuplicateTenantNameException)
            {
                return Results.Conflict(new TenantErrorDto(
                    "tenant_name_conflict",
                    $"Tenant name '{name}' already exists.",
                    "name"));
            }
        });

        return app;
    }

    private static TenantManagementDto MapTenant(Tenant tenant) => new(
        tenant.TenantId,
        tenant.Name,
        tenant.PlanName,
        tenant.Status,
        tenant.UserCount,
        tenant.ConnectorCount,
        tenant.DocumentsIndexed,
        tenant.LastActivityUtc,
        tenant.CreatedUtc,
        tenant.UpdatedUtc);
}
