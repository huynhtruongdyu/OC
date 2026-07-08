using Microsoft.AspNetCore.Authorization;

using OC.Bootstrapper.Domain.Authorization;

namespace OC.Bootstrapper.Application.Abstractions.Authorization;

public sealed class PermissionHandler : AuthorizationHandler<PermissionRequirement> {
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement) {
        if (context.User.HasClaim(AppPermissions.ClaimType, requirement.Permission)) {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}

public sealed record PermissionRequirement(string Permission) : IAuthorizationRequirement;
