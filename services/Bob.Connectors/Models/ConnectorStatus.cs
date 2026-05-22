namespace Bob.Connectors.Models;

public enum ConnectorStatus
{
    Healthy,
    Syncing,
    Degraded,
    Disabled,
    Failed
}
