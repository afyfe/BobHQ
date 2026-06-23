using Microsoft.Data.SqlClient;

namespace Bob.ConnectorPersistence.Data;

public sealed class SqlServerConnectionFactory : ISqlServerConnectionFactory
{
    private readonly string connectionString;

    public SqlServerConnectionFactory(string connectionString)
    {
        this.connectionString = connectionString;
    }

    public SqlConnection CreateConnection() => new(connectionString);
}
