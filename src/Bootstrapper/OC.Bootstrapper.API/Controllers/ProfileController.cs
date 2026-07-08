using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OC.Bootstrapper.API.Controllers.Base;
using OC.Bootstrapper.API.DTOs.Auth;
using OC.Bootstrapper.API.DTOs.Profile;
using OC.Bootstrapper.Application.Abstractions.Services;
using OC.Bootstrapper.Domain.Identities;

namespace OC.Bootstrapper.API.Controllers;

[Route("api/v{version:apiVersion}/profile")]
public sealed class ProfileController(
    UserManager<AppUser> userManager,
    IPermissionService permissionService) : InternalController {

    [HttpGet]
    public async Task<ActionResult<ApiResponse<ProfileResponse>>> GetProfile(CancellationToken ct) {
        var userId = userManager.GetUserId(User);
        if (userId is null)
            return Unauthorized(ApiResponse.Fail<ProfileResponse>("User not authenticated."));

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return Unauthorized(ApiResponse.Fail<ProfileResponse>("User not found."));

        var roles = await userManager.GetRolesAsync(user);
        var permissions = await permissionService.GetUserPermissionsAsync(user);

        return Ok(ApiResponse.Ok(new ProfileResponse(
            user.UserName ?? string.Empty,
            user.Email ?? string.Empty,
            user.DisplayName,
            [.. roles],
            [.. permissions])));
    }

    [HttpPut]
    public async Task<ActionResult<ApiResponse<object>>> UpdateProfile(
        [FromBody] UpdateProfileRequest request, CancellationToken ct) {
        var userId = userManager.GetUserId(User);
        if (userId is null)
            return Unauthorized(ApiResponse.Fail<object>("User not authenticated."));

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return Unauthorized(ApiResponse.Fail<object>("User not found."));

        user.DisplayName = request.DisplayName;
        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded) {
            var errors = result.Errors
                .GroupBy(e => e.Code)
                .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());
            return BadRequest(ApiResponse.Fail<object>("Profile update failed.", errors));
        }

        return Ok(ApiResponse.Ok<object>(new { }));
    }

    [HttpPost("change-password")]
    public async Task<ActionResult<ApiResponse<object>>> ChangePassword(
        [FromBody] ChangePasswordRequest request, CancellationToken ct) {
        var userId = userManager.GetUserId(User);
        if (userId is null)
            return Unauthorized(ApiResponse.Fail<object>("User not authenticated."));

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return Unauthorized(ApiResponse.Fail<object>("User not found."));

        var result = await userManager.ChangePasswordAsync(user,
            request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded) {
            var errors = result.Errors
                .GroupBy(e => e.Code)
                .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());
            return BadRequest(ApiResponse.Fail<object>("Password change failed.", errors));
        }

        return Ok(ApiResponse.Ok<object>(new { }));
    }
}
