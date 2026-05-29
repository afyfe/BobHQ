using Bob.Connectors.Models;

namespace Bob.Worker;

public sealed class ConnectorWorkerOptions
{
    public const string SectionName = "ConnectorWorker";

    public Guid TenantId { get; set; } = Guid.Parse("20000000-0000-0000-0000-000000000001");

    public string TenantName { get; set; } = "Northwind Legal";

    public ConnectorSyncMode SyncMode { get; set; } = ConnectorSyncMode.Incremental;

    public bool RunOnStartup { get; set; } = true;

    public int IntervalSeconds { get; set; } = 300;
}
