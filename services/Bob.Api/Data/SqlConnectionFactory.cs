using System.Data;
using Microsoft.Data.SqlClient;

namespace Bob.Api.Data;

public sealed class SqlConnectionFactory : ISqlConnectionFactory
{
    private readonly string connectionString;

    public SqlConnectionFactory(IConfiguration configuration)
    {
        connectionString = configuration.GetConnectionString("BobDb") ?? string.Empty;
    }

    public IDbConnection CreateConnection() => new SqlConnection(connectionString);
}
