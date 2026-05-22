using Bob.Connectors.Abstractions;
using Bob.Connectors.Models;

namespace Bob.Connectors.Runtime;

public abstract class ConnectorBase : IConnector, IConnectorHealthCheck
{
    private readonly List<string> messages = [];
    private readonly List<string> warnings = [];
    private readonly List<string> errors = [];

    protected ConnectorBase(Guid connectorId, string name, ConnectorType type, bool isEnabled = true)
    {
        ConnectorId = connectorId;
        Name = name;
        Type = type;
        IsEnabled = isEnabled;
    }

    public Guid ConnectorId { get; }

    public string Name { get; }

    public ConnectorType Type { get; }

    public bool IsEnabled { get; }

    public async Task<ConnectorExecutionResult> ExecuteAsync(
        ConnectorExecutionContext context,
        CancellationToken cancellationToken = default)
    {
        ResetLogBuffers();

        var startedUtc = DateTimeOffset.UtcNow;
        LogInfo($"Starting {context.SyncMode} sync for {context.TenantName}.");

        if (!IsEnabled)
        {
            LogWarning("Connector is disabled. Sync skipped.");
            return CreateResult(context, startedUtc, DateTimeOffset.UtcNow, ConnectorStatus.Disabled, []);
        }

        try
        {
            var items = await ExecuteCoreAsync(context, cancellationToken);
            var status = warnings.Count > 0 ? ConnectorStatus.Degraded : ConnectorStatus.Healthy;

            LogInfo($"Completed sync with {items.Count} item(s) processed.");
            return CreateResult(context, startedUtc, DateTimeOffset.UtcNow, status, items);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            LogError("Connector execution was cancelled.");
            return CreateResult(context, startedUtc, DateTimeOffset.UtcNow, ConnectorStatus.Failed, []);
        }
        catch (Exception ex)
        {
            LogError(ex.Message);
            return CreateResult(context, startedUtc, DateTimeOffset.UtcNow, ConnectorStatus.Failed, []);
        }
    }

    public virtual Task<ConnectorHealthResult> CheckHealthAsync(
        ConnectorExecutionContext context,
        CancellationToken cancellationToken = default)
    {
        ResetLogBuffers();
        cancellationToken.ThrowIfCancellationRequested();

        var status = IsEnabled ? ConnectorStatus.Healthy : ConnectorStatus.Disabled;
        var summary = IsEnabled ? "Connector is available for scheduled sync." : "Connector is disabled.";

        return Task.FromResult(CreateHealthResult(context, status, summary));
    }

    protected abstract Task<IReadOnlyList<ConnectorItem>> ExecuteCoreAsync(
        ConnectorExecutionContext context,
        CancellationToken cancellationToken);

    protected void LogInfo(string message) => messages.Add($"{DateTimeOffset.UtcNow:O} {message}");

    protected void LogWarning(string warning) => warnings.Add(warning);

    protected void LogError(string error) => errors.Add(error);

    protected ConnectorHealthResult CreateHealthResult(
        ConnectorExecutionContext context,
        ConnectorStatus status,
        string summary)
    {
        return new ConnectorHealthResult(
            context.ConnectorId,
            context.ConnectorName,
            context.ConnectorType,
            status,
            summary,
            DateTimeOffset.UtcNow,
            warnings.ToArray(),
            errors.ToArray());
    }

    private ConnectorExecutionResult CreateResult(
        ConnectorExecutionContext context,
        DateTimeOffset startedUtc,
        DateTimeOffset completedUtc,
        ConnectorStatus status,
        IReadOnlyList<ConnectorItem> items)
    {
        var duration = completedUtc - startedUtc;
        var log = new ConnectorExecutionLog(
            context.ConnectorName,
            context.TenantName,
            startedUtc,
            completedUtc,
            duration,
            status,
            items.Count,
            warnings.ToArray(),
            errors.ToArray(),
            messages.ToArray());

        return new ConnectorExecutionResult(
            context.ConnectorId,
            context.ConnectorName,
            context.ConnectorType,
            context.TenantId,
            context.TenantName,
            status,
            startedUtc,
            completedUtc,
            duration,
            items,
            warnings.ToArray(),
            errors.ToArray(),
            log);
    }

    private void ResetLogBuffers()
    {
        messages.Clear();
        warnings.Clear();
        errors.Clear();
    }
}
