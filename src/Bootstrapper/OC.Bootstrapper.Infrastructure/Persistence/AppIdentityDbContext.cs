using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OC.Bootstrapper.Domain.Identities;

namespace OC.Bootstrapper.Infrastructure.Persistence;

public class AppIdentityDbContext : IdentityDbContext<AppUser, AppRole, Guid>
{
    public AppIdentityDbContext(DbContextOptions<AppIdentityDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);
        base.OnModelCreating(builder);

        builder.Entity<AppUser>(e => e.ToTable("AppUsers"));
        builder.Entity<AppRole>(e => e.ToTable("AppRoles"));
        builder.Entity<IdentityUserClaim<Guid>>(e => e.ToTable("AppUserClaims"));
        builder.Entity<IdentityUserRole<Guid>>(e => e.ToTable("AppUserRoles"));
        builder.Entity<IdentityUserLogin<Guid>>(e => e.ToTable("AppUserLogins"));
        builder.Entity<IdentityUserToken<Guid>>(e => e.ToTable("AppUserTokens"));
        builder.Entity<IdentityRoleClaim<Guid>>(e => e.ToTable("AppRoleClaims"));
    }
}
