using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

using OC.Bootstrapper.Domain.Identities;

namespace OC.Bootstrapper.Infrastructure.Persistence.Seed;

public static class IdentitySeed {
    public static async Task SeedAsync(IServiceProvider serviceProvider) {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppIdentityDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<AppRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

        await context.Database.MigrateAsync();

        (Guid Id, string Name)[] roles =
        [
            (RoleConstants.SystemAdminId, RoleConstants.SystemAdmin),
            (RoleConstants.AdminId, RoleConstants.Admin),
            (RoleConstants.UserId, RoleConstants.User),
        ];
        foreach (var (id, name) in roles) {
            if (!await roleManager.RoleExistsAsync(name)) {
                await roleManager.CreateAsync(new AppRole { Id = id, Name = name });
            }
        }

        if (await userManager.FindByEmailAsync("root@oc.com") is null) {
            var root = new AppUser {
                UserName = "root",
                Email = "root@oc.com",
                DisplayName = "Root",
                EmailConfirmed = true,
            };

            var result = await userManager.CreateAsync(root, "Root@123");
            if (result.Succeeded) {
                await userManager.AddToRoleAsync(root, RoleConstants.SystemAdmin);
            }
        }
    }
}
