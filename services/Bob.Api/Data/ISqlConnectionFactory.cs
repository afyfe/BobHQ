using System.Data;

namespace Bob.Api.Data;

public interface ISqlConnectionFactory
{
    IDbConnection CreateConnection();
}
