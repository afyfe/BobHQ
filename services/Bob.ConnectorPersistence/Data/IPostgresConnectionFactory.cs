using Npgsql;

namespace Bob.ConnectorPersistence.Data;

public interface IPostgresConnectionFactory
{
    NpgsqlConnection CreateConnection();
}
