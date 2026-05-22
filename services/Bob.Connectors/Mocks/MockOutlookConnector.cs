using Bob.Connectors.Models;
using Bob.Connectors.Runtime;

namespace Bob.Connectors.Mocks;

public sealed class MockOutlookConnector : ConnectorBase
{
    public MockOutlookConnector()
        : base(Guid.Parse("10000000-0000-0000-0000-000000000002"), "Mock Outlook Mail", ConnectorType.Outlook)
    {
    }

    protected override async Task<IReadOnlyList<ConnectorItem>> ExecuteCoreAsync(
        ConnectorExecutionContext context,
        CancellationToken cancellationToken)
    {
        LogInfo("Opening mailbox ingestion window.");
        await Task.Delay(100, cancellationToken);

        LogInfo("Processing high-signal conversation threads.");
        await Task.Delay(160, cancellationToken);

        return
        [
            new ConnectorItem("mail-001", "Outlook", "Renewal risk thread", "message/rfc822", DateTimeOffset.UtcNow.AddMinutes(-17), 42_000),
            new ConnectorItem("mail-002", "Outlook", "Procurement approval trail", "message/rfc822", DateTimeOffset.UtcNow.AddHours(-2), 36_500)
        ];
    }
}
