namespace Bob.Connectors.Models;

public sealed record ConnectorItem(
    string ExternalId,
    string Source,
    string Title,
    string ContentType,
    DateTimeOffset? ModifiedUtc,
    long? SizeBytes,
    IReadOnlyDictionary<string, string>? Metadata = null);
