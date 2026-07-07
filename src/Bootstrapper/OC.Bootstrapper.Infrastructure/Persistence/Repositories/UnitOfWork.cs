using System.Collections.Concurrent;

using Microsoft.EntityFrameworkCore.Storage;

using OC.Bootstrapper.Application.Abstractions.Repositories;

namespace OC.Bootstrapper.Infrastructure.Persistence.Repositories;

public sealed class UnitOfWork : IUnitOfWork {
    private readonly AppDbContext _context;
    private readonly ConcurrentDictionary<Type, object> _repositories = new();
    private IDbContextTransaction? _transaction;
    private bool _disposed;

    public UnitOfWork(AppDbContext context) {
        _context = context;
    }

    public IWriteRepository<T> Repository<T>() where T : class {
        return (IWriteRepository<T>)_repositories.GetOrAdd(typeof(T), _ => new WriteRepository<T>(_context));
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default) {
        _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default) {
        if (_transaction is not null) {
            await _transaction.CommitAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default) {
        if (_transaction is not null) {
            await _transaction.RollbackAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose() {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    private void Dispose(bool disposing) {
        if (_disposed) return;

        if (disposing) {
            _transaction?.Dispose();
            _context.Dispose();
        }

        _disposed = true;
    }
}
