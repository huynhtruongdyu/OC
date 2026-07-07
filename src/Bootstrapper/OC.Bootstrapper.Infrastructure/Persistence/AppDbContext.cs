using Microsoft.EntityFrameworkCore;

using OC.Bootstrapper.Domain.Entities;
using OC.Bootstrapper.Infrastructure.Persistence.EntityConfigurations;

namespace OC.Bootstrapper.Infrastructure.Persistence;

public class AppDbContext : DbContext {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new CategoryConfiguration());
        modelBuilder.ApplyConfiguration(new ProductConfiguration());
    }
}
