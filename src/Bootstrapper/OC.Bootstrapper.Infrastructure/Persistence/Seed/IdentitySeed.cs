using System.Security.Claims;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

using OC.Bootstrapper.Domain.Authorization;
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

        var systemAdmin = await roleManager.FindByIdAsync(RoleConstants.SystemAdminId.ToString());
        if (systemAdmin is not null) {
            var existingClaims = await roleManager.GetClaimsAsync(systemAdmin);
            var existingPerms = existingClaims.Where(c => c.Type == AppPermissions.ClaimType).Select(c => c.Value).ToHashSet();
            foreach (var perm in AppPermissions.All.Where(p => !existingPerms.Contains(p))) {
                await roleManager.AddClaimAsync(systemAdmin, new Claim(AppPermissions.ClaimType, perm));
            }
        }

        var admin = await roleManager.FindByIdAsync(RoleConstants.AdminId.ToString());
        if (admin is not null) {
            var adminPerms = new HashSet<string> {
                AppPermissions.ProductsView, AppPermissions.ProductsCreate, AppPermissions.ProductsUpdate, AppPermissions.ProductsDelete,
                AppPermissions.CategoriesView, AppPermissions.CategoriesCreate, AppPermissions.CategoriesUpdate, AppPermissions.CategoriesDelete,
                AppPermissions.UsersView,
                AppPermissions.RolesView,
            };
            var existingClaims = await roleManager.GetClaimsAsync(admin);
            var existingPerms = existingClaims.Where(c => c.Type == AppPermissions.ClaimType).Select(c => c.Value).ToHashSet();
            foreach (var perm in adminPerms.Where(p => !existingPerms.Contains(p))) {
                await roleManager.AddClaimAsync(admin, new Claim(AppPermissions.ClaimType, perm));
            }
        }

        var userRole = await roleManager.FindByIdAsync(RoleConstants.UserId.ToString());
        if (userRole is not null) {
            var userPerms = new HashSet<string> {
                AppPermissions.ProductsView,
                AppPermissions.CategoriesView,
            };
            var existingClaims = await roleManager.GetClaimsAsync(userRole);
            var existingPerms = existingClaims.Where(c => c.Type == AppPermissions.ClaimType).Select(c => c.Value).ToHashSet();
            foreach (var perm in userPerms.Where(p => !existingPerms.Contains(p))) {
                await roleManager.AddClaimAsync(userRole, new Claim(AppPermissions.ClaimType, perm));
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
