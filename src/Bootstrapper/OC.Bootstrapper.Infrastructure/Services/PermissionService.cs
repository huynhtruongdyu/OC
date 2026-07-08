using Microsoft.AspNetCore.Identity;

using OC.Bootstrapper.Application.Abstractions.Services;
using OC.Bootstrapper.Domain.Authorization;
using OC.Bootstrapper.Domain.Identities;

namespace OC.Bootstrapper.Infrastructure.Services;

public sealed class PermissionService(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager) : IPermissionService {
    public async Task<IReadOnlyList<string>> GetUserPermissionsAsync(AppUser user) {
        var result = new HashSet<string>();

        var userClaims = await userManager.GetClaimsAsync(user);
        foreach (var claim in userClaims.Where(c => c.Type == AppPermissions.ClaimType)) {
            result.Add(claim.Value);
        }

        var roles = await userManager.GetRolesAsync(user);
        foreach (var roleName in roles) {
            var role = await roleManager.FindByNameAsync(roleName);
            if (role is null) continue;

            var roleClaims = await roleManager.GetClaimsAsync(role);
            foreach (var claim in roleClaims.Where(c => c.Type == AppPermissions.ClaimType)) {
                result.Add(claim.Value);
            }
        }

        return result.ToList();
    }
}
