using Bob.Api.Services;

namespace Bob.Api.Endpoints;

public static class DashboardEndpoints
{
    public static IEndpointRouteBuilder MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/dashboard", (IDashboardDataService data) => data.GetDashboard());
        app.MapGet("/api/dashboard/summary", (IDashboardDataService data) => data.GetDashboardSummary());
        app.MapGet("/api/connectors", (IDashboardDataService data) => data.GetConnectors());
        app.MapGet("/api/jobs", (IDashboardDataService data) => data.GetJobs());
        app.MapGet("/api/knowledge", (IDashboardDataService data) => data.GetKnowledgeItems());
        app.MapGet("/api/audit", (IDashboardDataService data) => data.GetAuditEntries());
        app.MapGet("/api/discovery", (IDashboardDataService data) => data.GetDiscoveryFindings());
        app.MapGet("/api/attention", (IDashboardDataService data) => data.GetAttentionAlerts());
        app.MapGet("/api/activity", (IDashboardDataService data) => data.GetActivityEvents());
        app.MapGet("/api/users", (IDashboardDataService data) => data.GetUsers());

        return app;
    }
}
