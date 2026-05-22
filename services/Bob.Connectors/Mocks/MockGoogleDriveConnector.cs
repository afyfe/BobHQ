using Bob.Connectors.Models;
using Bob.Connectors.Runtime;

namespace Bob.Connectors.Mocks;

public sealed class MockGoogleDriveConnector : ConnectorBase
{
    public MockGoogleDriveConnector()
        : base(Guid.Parse("10000000-0000-0000-0000-000000000003"), "Mock Google Drive", ConnectorType.GoogleDrive)
    {
    }

    protected override async Task<IReadOnlyList<ConnectorItem>> ExecuteCoreAsync(
        ConnectorExecutionContext context,
        CancellationToken cancellationToken)
    {
        LogInfo("Scanning shared drives for recent changes.");
        await Task.Delay(110, cancellationToken);

        LogInfo("Normalising Google document metadata.");
        await Task.Delay(130, cancellationToken);

        return
        [
            new ConnectorItem("gdrive-001", "Google Drive", "Partner Delivery Tracker", "application/vnd.google-apps.spreadsheet", DateTimeOffset.UtcNow.AddHours(-4), null),
            new ConnectorItem("gdrive-002", "Google Drive", "Implementation Notes", "application/vnd.google-apps.document", DateTimeOffset.UtcNow.AddDays(-2), null)
        ];
    }
}
