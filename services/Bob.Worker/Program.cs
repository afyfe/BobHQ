using Bob.Worker;
using Bob.Connectors.Abstractions;
using Bob.Connectors.Mocks;
using Bob.Connectors.Runtime;
using Bob.ConnectorPersistence.Abstractions;
using Bob.ConnectorPersistence.Data;
using Bob.ConnectorPersistence.Repositories;

var builder = Host.CreateApplicationBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddSimpleConsole(options =>
{
    options.SingleLine = true;
    options.TimestampFormat = "yyyy-MM-dd HH:mm:ss ";
});

builder.Services.Configure<ConnectorWorkerOptions>(
    builder.Configuration.GetSection(ConnectorWorkerOptions.SectionName));

builder.Services.AddSingleton<IConnector, MockSharePointConnector>();
builder.Services.AddSingleton<IConnector, MockOutlookConnector>();
builder.Services.AddSingleton<IConnector, MockGoogleDriveConnector>();
builder.Services.AddSingleton<IConnectorRuntime, ConnectorRuntimeService>();

var connectorPersistenceEnabled = builder.Configuration.GetValue("ConnectorPersistence:Enabled", false);

if (connectorPersistenceEnabled)
{
    var connectionString = builder.Configuration.GetConnectionString("AskBobSql");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException(
            "ConnectorPersistence:Enabled is true, but ConnectionStrings:AskBobSql is missing or empty.");
    }

    builder.Services.AddSingleton<ISqlServerConnectionFactory>(
        new SqlServerConnectionFactory(connectionString));
    builder.Services.AddSingleton<IConnectorRunWriter, SqlServerConnectorRunRepository>();
}
else
{
    builder.Services.AddSingleton<IConnectorRunWriter, NullConnectorRunRepository>();
}

builder.Services.AddHostedService<Worker>();
builder.Services.AddSystemd();

var host = builder.Build();
host.Run();
