using Bob.Api.Domain;

namespace Bob.Api.Repositories;

public interface IJobRepository
{
    Task<IReadOnlyList<Job>> ListAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Job>> ListByStatusAsync(string status, CancellationToken cancellationToken = default);
}
