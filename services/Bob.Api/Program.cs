using Bob.Api.Endpoints;
using Bob.Api.Services;

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

builder.Services.AddSingleton<IDashboardDataService, MockDashboardDataService>();

var app = builder.Build();

app.UseCors("ViteDev");

app.MapGet("/health", () => Results.Ok("OK"));
app.MapDashboardEndpoints();

app.Run();
