namespace OC.Bootstrapper.Application.Abstractions.Repositories;

public interface IWriteRepository<T> where T : class {
    Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}
