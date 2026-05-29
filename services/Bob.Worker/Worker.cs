using Bob.Connectors.Abstractions;
using Bob.Connectors.Models;
using Microsoft.Extensions.Options;

namespace Bob.Worker;

public sealed class Worker : BackgroundService
{
    private readonly ILogger<Worker> logger;
    private readonly IConnectorRuntime connectorRuntime;
    private readonly ConnectorWorkerOptions options;

    public Worker(
        ILogger<Worker> logger,
        IConnectorRuntime connectorRuntime,
        IOptions<ConnectorWorkerOptions> options)
    {
        this.logger = logger;
        this.connectorRuntime = connectorRuntime;
        this.options = options.Value;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation(
            "Bob.Worker starting with {ConnectorCount} connector(s). Tenant={TenantName}, Mode={SyncMode}, IntervalSeconds={IntervalSeconds}",
            connectorRuntime.Connectors.Count,
            options.TenantName,
            options.SyncMode,
            options.IntervalSeconds);

        if (options.RunOnStartup)
        {
            await RunConnectorsAsync(stoppingToken);
        }

        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(Math.Max(options.IntervalSeconds, 30)));

        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await RunConnectorsAsync(stoppingToken);
        }
    }

    private async Task RunConnectorsAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Starting connector runtime cycle at {StartedUtc}", DateTimeOffset.UtcNow);

        IReadOnlyList<ConnectorExecutionResult> results;

        try
        {
            results = await connectorRuntime.ExecuteEnabledConnectorsAsync(
                options.TenantId,
                options.TenantName,
                options.SyncMode,
                stoppingToken);
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
            logger.LogInformation("Connector runtime cycle cancelled.");
            return;
        }

        foreach (var result in results)
        {
            LogConnectorResult(result);
        }

        logger.LogInformation(
            "Connector runtime cycle completed. Connectors={ConnectorCount}, ItemsProcessed={ItemsProcessed}, Failed={FailedCount}, Degraded={DegradedCount}",
            results.Count,
            results.Sum(result => result.Items.Count),
            results.Count(result => result.Status == ConnectorStatus.Failed),
            results.Count(result => result.Status == ConnectorStatus.Degraded));
    }

    private void LogConnectorResult(ConnectorExecutionResult result)
    {
        var level = result.Status switch
        {
            ConnectorStatus.Failed => LogLevel.Error,
            ConnectorStatus.Degraded => LogLevel.Warning,
            ConnectorStatus.Disabled => LogLevel.Warning,
            _ => LogLevel.Information
        };

        logger.Log(
            level,
            "Connector {ConnectorName} completed with {Status}. Tenant={TenantName}, Items={ItemsProcessed}, DurationMs={DurationMs}, Warnings={WarningCount}, Errors={ErrorCount}",
            result.ConnectorName,
            result.Status,
            result.TenantName,
            result.Items.Count,
            result.Duration.TotalMilliseconds,
            result.Warnings.Count,
            result.Errors.Count);

        foreach (var message in result.Log.Messages)
        {
            logger.LogInformation("Connector {ConnectorName}: {Message}", result.ConnectorName, message);
        }

        foreach (var warning in result.Warnings)
        {
            logger.LogWarning("Connector {ConnectorName} warning: {Warning}", result.ConnectorName, warning);
        }

        foreach (var error in result.Errors)
        {
            logger.LogError("Connector {ConnectorName} error: {Error}", result.ConnectorName, error);
        }
    }
}
