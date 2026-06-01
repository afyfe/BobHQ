using Bob.Api.Endpoints;
using Bob.Api.Data;
using Bob.Api.Services;
using Bob.ConnectorPersistence.Abstractions;
using Bob.ConnectorPersistence.Data;
using Bob.ConnectorPersistence.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("ViteDev", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var dataSource = builder.Configuration["BobApi:DataSource"] ?? "Mock";

if (string.Equals(dataSource, "Sql", StringComparison.OrdinalIgnoreCase))
{
    var connectionString = builder.Configuration.GetConnectionString("BobDb");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException("BobApi:DataSource is set to Sql, but ConnectionStrings:BobDb is missing or empty.");
    }

    builder.Services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
    builder.Services.AddSingleton<IDashboardDataService, SqlDashboardDataService>();
}
else if (string.Equals(dataSource, "Mock", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddSingleton<IDashboardDataService, MockDashboardDataService>();
}
else
{
    throw new InvalidOperationException($"Unsupported BobApi:DataSource value '{dataSource}'. Valid values are 'Mock' and 'Sql'.");
}

var connectorPersistenceEnabled = builder.Configuration.GetValue("ConnectorPersistence:Enabled", false);

if (connectorPersistenceEnabled)
{
    var connectionString = builder.Configuration.GetConnectionString("ConnectorDb");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException(
            "ConnectorPersistence:Enabled is true, but ConnectionStrings:ConnectorDb is missing or empty.");
    }

    builder.Services.AddSingleton<IPostgresConnectionFactory>(
        new PostgresConnectionFactory(connectionString));
    builder.Services.AddSingleton<IConnectorRunReader, PostgresConnectorRunRepository>();
}
else
{
    builder.Services.AddSingleton<IConnectorRunReader, NullConnectorRunRepository>();
}

var app = builder.Build();

app.UseCors("ViteDev");

app.MapGet("/health", () => Results.Ok("OK"));
app.MapDashboardEndpoints();
app.MapConnectorRunEndpoints();

app.Run();
