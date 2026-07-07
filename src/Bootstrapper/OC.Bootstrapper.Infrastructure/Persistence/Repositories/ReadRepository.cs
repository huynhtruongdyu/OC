using System.Linq.Expressions;

using Microsoft.EntityFrameworkCore;

using OC.Bootstrapper.Application.Abstractions.Repositories;

namespace OC.Bootstrapper.Infrastructure.Persistence.Repositories;

public sealed class ReadRepository<T> : IReadRepository<T> where T : class {
    private readonly AppDbContext _context;

    public ReadRepository(AppDbContext context) {
        _context = context;
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default) {
        return await _context.Set<T>().FindAsync([id], ct);
    }

    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default) {
        return await _context.Set<T>().ToListAsync(ct);
    }

    public async Task<IReadOnlyList<T>> GetAllAsync(params Expression<Func<T, object>>[] includes) {
        var query = _context.Set<T>().AsQueryable();
        foreach (var include in includes) {
            query = query.Include(include);
        }
        return await query.ToListAsync();
    }

    public async Task<IReadOnlyList<T>> GetAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default) {
        return await _context.Set<T>().Where(predicate).ToListAsync(ct);
    }

    public async Task<IReadOnlyList<T>> GetAsync(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes) {
        var query = _context.Set<T>().Where(predicate);
        foreach (var include in includes) {
            query = query.Include(include);
        }
        return await query.ToListAsync();
    }
}
