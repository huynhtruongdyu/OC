using Microsoft.EntityFrameworkCore;

using OC.Bootstrapper.Application.Abstractions.Repositories;

namespace OC.Bootstrapper.Infrastructure.Persistence.Repositories;

public class WriteRepository<T> : IWriteRepository<T> where T : class {
    private readonly AppDbContext _context;

    public WriteRepository(AppDbContext context) {
        _context = context;
    }

    public async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default) {
        var entry = await _context.Set<T>().AddAsync(entity, cancellationToken);
        return entry.Entity;
    }

    public Task UpdateAsync(T entity) {
        _context.Entry(entity).State = EntityState.Modified;
        return Task.CompletedTask;
    }

    public Task DeleteAsync(T entity) {
        _context.Set<T>().Remove(entity);
        return Task.CompletedTask;
    }
}
