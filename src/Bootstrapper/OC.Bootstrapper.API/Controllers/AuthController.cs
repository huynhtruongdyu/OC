using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using OC.Bootstrapper.API.DTOs.Auth;
using OC.Bootstrapper.Application.Abstractions.Services;
using OC.Bootstrapper.Domain.Identities;

namespace OC.Bootstrapper.API.Controllers;

public sealed class AuthController(
    UserManager<AppUser> userManager,
    SignInManager<AppUser> signInManager,
    IJwtService jwtService) : PublicController {
    [HttpPost]
    public async Task<ApiResponse<AuthResponse>> Login([FromBody] LoginRequest request, CancellationToken ct) {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null) {
            return ApiResponse.Fail<AuthResponse>("Invalid email or password.");
        }

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded) {
            return ApiResponse.Fail<AuthResponse>("Invalid email or password.");
        }

        var roles = await userManager.GetRolesAsync(user);
        var token = jwtService.GenerateToken(user, roles);

        return ApiResponse.Ok(new AuthResponse(token, user.Email ?? string.Empty, user.DisplayName, roles));
    }

    [HttpPost]
    public async Task<ApiResponse<AuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken ct) {
        var existing = await userManager.FindByEmailAsync(request.Email);
        if (existing is not null) {
            return ApiResponse.Fail<AuthResponse>("Email already registered.");
        }

        var user = new AppUser {
            UserName = request.Email,
            Email = request.Email,
            DisplayName = request.DisplayName,
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded) {
            var errors = result.Errors
                .GroupBy(e => e.Code)
                .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());

            return ApiResponse.Fail<AuthResponse>("Registration failed.", errors);
        }

        await userManager.AddToRoleAsync(user, RoleConstants.User);

        var roles = await userManager.GetRolesAsync(user);
        var token = jwtService.GenerateToken(user, roles);

        return ApiResponse.Ok(new AuthResponse(token, user.Email ?? string.Empty, user.DisplayName, roles));
    }
}
