using Bob.ConnectorPersistence.Abstractions;

namespace Bob.Api.Endpoints;

public static class ConnectorRunEndpoints
{
    public static IEndpointRouteBuilder MapConnectorRunEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/connectors/runs", async (
            IConnectorRunReader data,
            int? limit,
            CancellationToken cancellationToken) =>
            await data.GetRunsAsync(limit ?? 100, cancellationToken));

        app.MapGet("/api/connectors/health", async (
            IConnectorRunReader data,
            CancellationToken cancellationToken) =>
            await data.GetHealthAsync(cancellationToken));

        app.MapGet("/api/connectors/latest", async (
            IConnectorRunReader data,
            CancellationToken cancellationToken) =>
            await data.GetLatestAsync(cancellationToken));

        return app;
    }
}
