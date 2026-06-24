using Bob.Api.Endpoints;
using Bob.Api.Data;
using Bob.Api.Repositories;
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

var dataSource = builder.Configuration["BobApi:DataSource"] ?? "Sql";
var bobDbConnectionString = builder.Configuration.GetConnectionString("BobDb");
var hasBobDbConnectionString = !string.IsNullOrWhiteSpace(bobDbConnectionString);
var sqlConnectionFactoryRegistered = false;

if (string.Equals(dataSource, "Sql", StringComparison.OrdinalIgnoreCase))
{
    if (!hasBobDbConnectionString)
    {
        throw new InvalidOperationException("BobApi:DataSource is set to Sql, but ConnectionStrings:BobDb is missing or empty.");
    }

    builder.Services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
    sqlConnectionFactoryRegistered = true;
    builder.Services.AddSingleton<IDashboardDataService, SqlDashboardDataService>();
}
else if (string.Equals(dataSource, "Mock", StringComparison.OrdinalIgnoreCase))
{
    throw new InvalidOperationException("BobApi:DataSource=Mock is no longer supported. Configure BobApi:DataSource=Sql.");
}
else
{
    throw new InvalidOperationException($"Unsupported BobApi:DataSource value '{dataSource}'. Valid value is 'Sql'.");
}

var tenantDataSource = builder.Configuration["TenantManagement:DataSource"]
    ?? "Sql";

if (string.Equals(tenantDataSource, "Sql", StringComparison.OrdinalIgnoreCase))
{
    if (!hasBobDbConnectionString)
    {
        throw new InvalidOperationException(
            "TenantManagement:DataSource is set to Sql, but ConnectionStrings:BobDb is missing or empty.");
    }

    if (!sqlConnectionFactoryRegistered)
    {
        builder.Services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
    }

    builder.Services.AddSingleton<ITenantRepository, SqlTenantRepository>();
}
else if (string.Equals(tenantDataSource, "Memory", StringComparison.OrdinalIgnoreCase))
{
    throw new InvalidOperationException(
        "TenantManagement:DataSource=Memory is no longer supported. Configure TenantManagement:DataSource=Sql.");
}
else
{
    throw new InvalidOperationException(
        $"Unsupported TenantManagement:DataSource value '{tenantDataSource}'. Valid value is 'Sql'.");
}

var connectorPersistenceEnabled = builder.Configuration.GetValue("ConnectorPersistence:Enabled", true);

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
    builder.Services.AddSingleton<IConnectorRunReader, SqlServerConnectorRunRepository>();
}
else
{
    throw new InvalidOperationException(
        "ConnectorPersistence:Enabled=false is no longer supported for Bob.Api. Configure ConnectorPersistence:Enabled=true.");
}

var app = builder.Build();

app.UseCors("ViteDev");

app.MapGet("/health", () => Results.Ok("OK"));
app.MapDashboardEndpoints();
app.MapTenantEndpoints();
app.MapConnectorRunEndpoints();

app.Run();
