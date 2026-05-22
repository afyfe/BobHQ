using Bob.Connectors.Mocks;
using Bob.Connectors.Models;
using Bob.Connectors.Runtime;

var tenantId = Guid.Parse("20000000-0000-0000-0000-000000000001");
var tenantName = "Northwind Legal";
var syncMode = ConnectorSyncMode.Incremental;

var runtime = new ConnectorRuntimeService(
[
    new MockSharePointConnector(),
    new MockOutlookConnector(),
    new MockGoogleDriveConnector()
]);

Console.WriteLine("BobHQ Connector Sandbox");
Console.WriteLine($"Tenant: {tenantName}");
Console.WriteLine($"Mode: {syncMode}");
Console.WriteLine();

var results = await runtime.ExecuteEnabledConnectorsAsync(tenantId, tenantName, syncMode);

foreach (var result in results)
{
    Console.WriteLine($"{result.ConnectorName} [{result.Status}]");
    Console.WriteLine($"  Duration: {result.Duration.TotalMilliseconds:0} ms");
    Console.WriteLine($"  Items processed: {result.Items.Count}");

    foreach (var warning in result.Warnings)
    {
        Console.WriteLine($"  Warning: {warning}");
    }

    foreach (var error in result.Errors)
    {
        Console.WriteLine($"  Error: {error}");
    }

    foreach (var message in result.Log.Messages)
    {
        Console.WriteLine($"  Log: {message}");
    }

    Console.WriteLine();
}

var failed = results.Count(result => result.Status == ConnectorStatus.Failed);
var degraded = results.Count(result => result.Status == ConnectorStatus.Degraded);
var processed = results.Sum(result => result.Items.Count);

Console.WriteLine($"Summary: {processed} item(s), {degraded} degraded connector(s), {failed} failed connector(s).");
