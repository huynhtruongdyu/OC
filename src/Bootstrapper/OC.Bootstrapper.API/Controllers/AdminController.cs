using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OC.Bootstrapper.API.DTOs.Admin;
using OC.Bootstrapper.Application.Abstractions.Authorization;
using OC.Bootstrapper.Domain.Authorization;
using OC.Bootstrapper.Domain.Identities;

namespace OC.Bootstrapper.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin")]
public sealed class AdminController(
    UserManager<AppUser> userManager,
    RoleManager<AppRole> roleManager) : ControllerBase {

    private async Task<IReadOnlyList<string>> GetUserPermissionsAsync(AppUser user) {
        var claims = await userManager.GetClaimsAsync(user);
        return claims.Where(c => c.Type == AppPermissions.ClaimType).Select(c => c.Value).ToList();
    }

    private async Task<AdminUserResponse> BuildUserResponseAsync(AppUser user) {
        var roles = await userManager.GetRolesAsync(user);
        var permissions = await GetUserPermissionsAsync(user);
        return new AdminUserResponse(
            user.Id, user.UserName ?? string.Empty, user.Email ?? string.Empty,
            user.DisplayName, [.. roles], [.. permissions],
            user.LockoutEnabled, user.LockoutEnd);
    }

    private async Task SyncUserPermissionsAsync(AppUser user, IReadOnlyList<string> newPermissions) {
        var existing = await userManager.GetClaimsAsync(user);
        var existingPerms = existing.Where(c => c.Type == AppPermissions.ClaimType).ToList();
        foreach (var claim in existingPerms) {
            await userManager.RemoveClaimAsync(user, claim);
        }
        foreach (var perm in newPermissions) {
            await userManager.AddClaimAsync(user, new Claim(AppPermissions.ClaimType, perm));
        }
    }

    [HttpGet("users")]
    [HasPermission(AppPermissions.UsersView)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<AdminUserResponse>>>> GetUsers(CancellationToken ct) {
        var users = await userManager.Users.Where(u => u.UserName != "root").ToListAsync(ct);
        var result = new List<AdminUserResponse>();
        foreach (var appUser in users) {
            result.Add(await BuildUserResponseAsync(appUser));
        }
        return Ok(ApiResponse.Ok((IReadOnlyList<AdminUserResponse>)result));
    }

    [HttpGet("users/{id:guid}")]
    [HasPermission(AppPermissions.UsersView)]
    public async Task<ActionResult<ApiResponse<AdminUserResponse>>> GetUserById(Guid id, CancellationToken ct) {
        var appUser = await userManager.FindByIdAsync(id.ToString());
        if (appUser is null)
            return NotFound(ApiResponse.Fail<AdminUserResponse>("User not found."));

        if (appUser.UserName == "root")
            return NotFound(ApiResponse.Fail<AdminUserResponse>("User not found."));

        return Ok(ApiResponse.Ok(await BuildUserResponseAsync(appUser)));
    }

    [HttpPost("users")]
    [HasPermission(AppPermissions.UsersCreate)]
    public async Task<ActionResult<ApiResponse<AdminUserResponse>>> CreateUser([FromBody] CreateUserRequest request, CancellationToken ct) {
        var appUser = new AppUser {
            UserName = request.UserName,
            Email = request.Email,
            DisplayName = request.DisplayName,
            EmailConfirmed = true,
        };

        var createResult = await userManager.CreateAsync(appUser, request.Password);
        if (!createResult.Succeeded) {
            var errors = createResult.Errors
                .GroupBy(e => e.Code)
                .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());
            return BadRequest(ApiResponse.Fail<AdminUserResponse>("User creation failed.", errors));
        }

        if (request.Roles.Count > 0) {
            await userManager.AddToRolesAsync(appUser, request.Roles);
        }

        if (request.Permissions?.Count > 0) {
            await SyncUserPermissionsAsync(appUser, request.Permissions);
        }

        return CreatedAtAction(nameof(GetUserById), new { id = appUser.Id, version = "1.0" },
            ApiResponse.Ok(await BuildUserResponseAsync(appUser)));
    }

    [HttpPut("users/{id:guid}")]
    [HasPermission(AppPermissions.UsersUpdate)]
    public async Task<ActionResult<ApiResponse<object>>> UpdateUser(Guid id, [FromBody] UpdateUserRequest request, CancellationToken ct) {
        var appUser = await userManager.FindByIdAsync(id.ToString());
        if (appUser is null)
            return NotFound(ApiResponse.Fail<object>("User not found."));

        if (appUser.UserName == "root")
            return BadRequest(ApiResponse.Fail<object>("Cannot modify the root user."));

        appUser.UserName = request.UserName;
        appUser.Email = request.Email;
        appUser.DisplayName = request.DisplayName;

        var updateResult = await userManager.UpdateAsync(appUser);
        if (!updateResult.Succeeded) {
            var errors = updateResult.Errors
                .GroupBy(e => e.Code)
                .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());
            return BadRequest(ApiResponse.Fail<object>("User update failed.", errors));
        }

        var currentRoles = await userManager.GetRolesAsync(appUser);
        await userManager.RemoveFromRolesAsync(appUser, currentRoles);
        if (request.Roles.Count > 0) {
            await userManager.AddToRolesAsync(appUser, request.Roles);
        }

        if (request.Permissions is not null) {
            await SyncUserPermissionsAsync(appUser, request.Permissions);
        }

        return NoContent();
    }

    [HttpDelete("users/{id:guid}")]
    [HasPermission(AppPermissions.UsersDelete)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteUser(Guid id, CancellationToken ct) {
        var appUser = await userManager.FindByIdAsync(id.ToString());
        if (appUser is null)
            return NotFound(ApiResponse.Fail<object>("User not found."));

        if (appUser.UserName == "root")
            return BadRequest(ApiResponse.Fail<object>("Cannot delete the root user."));

        await userManager.DeleteAsync(appUser);
        return NoContent();
    }

    [HttpGet("users/{id:guid}/roles")]
    [HasPermission(AppPermissions.UsersView)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<string>>>> GetUserRoles(Guid id, CancellationToken ct) {
        var appUser = await userManager.FindByIdAsync(id.ToString());
        if (appUser is null)
            return NotFound(ApiResponse.Fail<IReadOnlyList<string>>("User not found."));

        if (appUser.UserName == "root")
            return NotFound(ApiResponse.Fail<IReadOnlyList<string>>("User not found."));

        var userRoles = await userManager.GetRolesAsync(appUser);
        return Ok(ApiResponse.Ok((IReadOnlyList<string>)[.. userRoles]));
    }

    [HttpPut("users/{id:guid}/roles")]
    [HasPermission(AppPermissions.UsersUpdate)]
    public async Task<ActionResult<ApiResponse<object>>> UpdateUserRoles(Guid id, [FromBody] IReadOnlyList<string> newRoles, CancellationToken ct) {
        var appUser = await userManager.FindByIdAsync(id.ToString());
        if (appUser is null)
            return NotFound(ApiResponse.Fail<object>("User not found."));

        if (appUser.UserName == "root")
            return BadRequest(ApiResponse.Fail<object>("Cannot modify the root user."));

        var currentRoles = await userManager.GetRolesAsync(appUser);
        await userManager.RemoveFromRolesAsync(appUser, currentRoles);
        if (newRoles.Count > 0) {
            await userManager.AddToRolesAsync(appUser, newRoles);
        }

        return NoContent();
    }

    [HttpGet("users/{id:guid}/permissions")]
    [HasPermission(AppPermissions.UsersView)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<string>>>> GetUserPermissions(Guid id, CancellationToken ct) {
        var appUser = await userManager.FindByIdAsync(id.ToString());
        if (appUser is null)
            return NotFound(ApiResponse.Fail<IReadOnlyList<string>>("User not found."));

        if (appUser.UserName == "root")
            return NotFound(ApiResponse.Fail<IReadOnlyList<string>>("User not found."));

        return Ok(ApiResponse.Ok(await GetUserPermissionsAsync(appUser)));
    }

    [HttpPut("users/{id:guid}/permissions")]
    [HasPermission(AppPermissions.UsersUpdate)]
    public async Task<ActionResult<ApiResponse<object>>> UpdateUserPermissions(Guid id, [FromBody] UpdateRolePermissionsRequest request, CancellationToken ct) {
        var appUser = await userManager.FindByIdAsync(id.ToString());
        if (appUser is null)
            return NotFound(ApiResponse.Fail<object>("User not found."));

        if (appUser.UserName == "root")
            return BadRequest(ApiResponse.Fail<object>("Cannot modify the root user."));

        await SyncUserPermissionsAsync(appUser, request.Permissions);
        return NoContent();
    }

    [HttpGet("roles")]
    [HasPermission(AppPermissions.RolesView)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<AdminRoleResponse>>>> GetRoles(CancellationToken ct) {
        var roles = await roleManager.Roles.Where(r => r.Name != RoleConstants.SystemAdmin).ToListAsync(ct);
        var result = roles.Select(r => new AdminRoleResponse(r.Id, r.Name ?? string.Empty)).ToList();
        return Ok(ApiResponse.Ok((IReadOnlyList<AdminRoleResponse>)result));
    }

    [HttpGet("roles/{id:guid}")]
    [HasPermission(AppPermissions.RolesView)]
    public async Task<ActionResult<ApiResponse<RoleDetailResponse>>> GetRole(Guid id, CancellationToken ct) {
        var role = await roleManager.FindByIdAsync(id.ToString());
        if (role is null)
            return NotFound(ApiResponse.Fail<RoleDetailResponse>("Role not found."));

        if (role.Name == RoleConstants.SystemAdmin)
            return NotFound(ApiResponse.Fail<RoleDetailResponse>("Role not found."));

        var claims = await roleManager.GetClaimsAsync(role);
        var permissions = claims.Where(c => c.Type == AppPermissions.ClaimType).Select(c => c.Value).ToList();
        return Ok(ApiResponse.Ok(new RoleDetailResponse(role.Id, role.Name ?? string.Empty, permissions)));
    }

    [HttpPost("roles")]
    [HasPermission(AppPermissions.RolesCreate)]
    public async Task<ActionResult<ApiResponse<AdminRoleResponse>>> CreateRole([FromBody] CreateRoleRequest request, CancellationToken ct) {
        if (await roleManager.RoleExistsAsync(request.Name))
            return BadRequest(ApiResponse.Fail<AdminRoleResponse>("Role already exists."));

        var role = new AppRole { Name = request.Name };
        var createResult = await roleManager.CreateAsync(role);
        if (!createResult.Succeeded) {
            var errors = createResult.Errors
                .GroupBy(e => e.Code)
                .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());
            return BadRequest(ApiResponse.Fail<AdminRoleResponse>("Role creation failed.", errors));
        }

        return CreatedAtAction(nameof(GetRole), new { id = role.Id, version = "1.0" },
            ApiResponse.Ok(new AdminRoleResponse(role.Id, role.Name ?? string.Empty)));
    }

    [HttpPut("roles/{id:guid}")]
    [HasPermission(AppPermissions.RolesUpdate)]
    public async Task<ActionResult<ApiResponse<object>>> UpdateRole(Guid id, [FromBody] UpdateRoleRequest request, CancellationToken ct) {
        var role = await roleManager.FindByIdAsync(id.ToString());
        if (role is null)
            return NotFound(ApiResponse.Fail<object>("Role not found."));

        if (role.Name == RoleConstants.SystemAdmin)
            return BadRequest(ApiResponse.Fail<object>("Cannot modify the System Admin role."));

        role.Name = request.Name;
        var updateResult = await roleManager.UpdateAsync(role);
        if (!updateResult.Succeeded) {
            var errors = updateResult.Errors
                .GroupBy(e => e.Code)
                .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());
            return BadRequest(ApiResponse.Fail<object>("Role update failed.", errors));
        }

        return NoContent();
    }

    [HttpDelete("roles/{id:guid}")]
    [HasPermission(AppPermissions.RolesDelete)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteRole(Guid id, CancellationToken ct) {
        var role = await roleManager.FindByIdAsync(id.ToString());
        if (role is null)
            return NotFound(ApiResponse.Fail<object>("Role not found."));

        if (role.Name == RoleConstants.SystemAdmin || role.Name == RoleConstants.Admin || role.Name == RoleConstants.User)
            return BadRequest(ApiResponse.Fail<object>("Cannot delete system roles."));

        await roleManager.DeleteAsync(role);
        return NoContent();
    }

    [HttpGet("roles/{id:guid}/permissions")]
    [HasPermission(AppPermissions.RolesView)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<string>>>> GetRolePermissions(Guid id, CancellationToken ct) {
        var role = await roleManager.FindByIdAsync(id.ToString());
        if (role is null)
            return NotFound(ApiResponse.Fail<IReadOnlyList<string>>("Role not found."));

        if (role.Name == RoleConstants.SystemAdmin)
            return NotFound(ApiResponse.Fail<IReadOnlyList<string>>("Role not found."));

        var claims = await roleManager.GetClaimsAsync(role);
        var permissions = claims.Where(c => c.Type == AppPermissions.ClaimType).Select(c => c.Value).ToList();
        return Ok(ApiResponse.Ok((IReadOnlyList<string>)permissions));
    }

    [HttpPut("roles/{id:guid}/permissions")]
    [HasPermission(AppPermissions.RolesUpdate)]
    public async Task<ActionResult<ApiResponse<object>>> UpdateRolePermissions(Guid id, [FromBody] UpdateRolePermissionsRequest request, CancellationToken ct) {
        var role = await roleManager.FindByIdAsync(id.ToString());
        if (role is null)
            return NotFound(ApiResponse.Fail<object>("Role not found."));

        if (role.Name == RoleConstants.SystemAdmin)
            return BadRequest(ApiResponse.Fail<object>("Cannot modify the System Admin role."));

        var existingClaims = await roleManager.GetClaimsAsync(role);
        var existingPermissions = existingClaims.Where(c => c.Type == AppPermissions.ClaimType).ToList();

        foreach (var claim in existingPermissions) {
            await roleManager.RemoveClaimAsync(role, claim);
        }

        foreach (var permission in request.Permissions) {
            await roleManager.AddClaimAsync(role, new Claim(AppPermissions.ClaimType, permission));
        }

        return NoContent();
    }

    [HttpGet("permissions")]
    [HasPermission(AppPermissions.RolesView)]
    public ActionResult<ApiResponse<IReadOnlyList<PermissionGroupResponse>>> GetPermissions() {
        var groups = AppPermissions.Groups
            .Select(g => new PermissionGroupResponse(g.Key, g.Value))
            .ToList();
        return Ok(ApiResponse.Ok((IReadOnlyList<PermissionGroupResponse>)groups));
    }
}
