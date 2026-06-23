using Microsoft.Data.SqlClient;

namespace Bob.ConnectorPersistence.Data;

public interface ISqlServerConnectionFactory
{
    SqlConnection CreateConnection();
}
