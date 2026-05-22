using Bob.Connectors.Models;
using Bob.Connectors.Runtime;

namespace Bob.Connectors.Mocks;

public sealed class MockSharePointConnector : ConnectorBase
{
    public MockSharePointConnector()
        : base(Guid.Parse("10000000-0000-0000-0000-000000000001"), "Mock SharePoint", ConnectorType.SharePoint)
    {
    }

    protected override async Task<IReadOnlyList<ConnectorItem>> ExecuteCoreAsync(
        ConnectorExecutionContext context,
        CancellationToken cancellationToken)
    {
        LogInfo("Enumerating SharePoint libraries.");
        await Task.Delay(120, cancellationToken);

        LogInfo("Reading updated documents from Operations and Finance libraries.");
        await Task.Delay(140, cancellationToken);

        LogWarning("One library has stale permissions metadata and will need a later refresh.");

        return
        [
            new ConnectorItem("sp-doc-001", "SharePoint", "Operations Runbook", "application/pdf", DateTimeOffset.UtcNow.AddHours(-3), 128_000),
            new ConnectorItem("sp-doc-002", "SharePoint", "Quarterly Board Pack", "application/vnd.openxmlformats-officedocument.presentationml.presentation", DateTimeOffset.UtcNow.AddDays(-1), 845_000),
            new ConnectorItem("sp-doc-003", "SharePoint", "Customer Escalation Notes", "text/markdown", DateTimeOffset.UtcNow.AddMinutes(-42), 18_400)
        ];
    }
}
