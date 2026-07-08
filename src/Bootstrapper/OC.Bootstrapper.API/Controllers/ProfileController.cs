using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OC.Bootstrapper.API.DTOs.Auth;
using OC.Bootstrapper.Domain.Identities;

namespace OC.Bootstrapper.API.Controllers;

[ApiController]
[Authorize]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/profile")]
public sealed class ProfileController(
    UserManager<AppUser> userManager) : ControllerBase {

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
