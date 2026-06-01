using Npgsql;

namespace Bob.ConnectorPersistence.Data;

public sealed class PostgresConnectionFactory : IPostgresConnectionFactory
{
    private readonly string connectionString;

    public PostgresConnectionFactory(string connectionString)
    {
        this.connectionString = connectionString;
    }

    public NpgsqlConnection CreateConnection() => new(connectionString);
}
