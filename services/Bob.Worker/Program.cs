using Bob.Worker;
using Bob.Connectors.Abstractions;
using Bob.Connectors.Mocks;
using Bob.Connectors.Runtime;

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
builder.Services.AddHostedService<Worker>();
builder.Services.AddSystemd();

var host = builder.Build();
host.Run();
