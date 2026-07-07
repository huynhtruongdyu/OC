using OC.Bootstrapper.Domain.Identities;
using OC.Bootstrapper.Infrastructure.Persistence;

namespace Microsoft.Extensions.DependencyInjection;

public static class IdentityExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services)
    {
        services.AddIdentity<AppUser, AppRole>()
            .AddEntityFrameworkStores<AppIdentityDbContext>();

        return services;
    }
}
