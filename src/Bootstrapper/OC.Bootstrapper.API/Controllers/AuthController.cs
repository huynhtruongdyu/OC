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
        var user = await userManager.FindByNameAsync(request.Username);
        if (user is null) {
            return ApiResponse.Fail<AuthResponse>("Invalid username or password.");
        }

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded) {
            return ApiResponse.Fail<AuthResponse>("Invalid username or password.");
        }

        var roles = await userManager.GetRolesAsync(user);
        var accessToken = jwtService.GenerateAccessToken(user, roles);
        var refreshToken = jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await userManager.UpdateAsync(user);

        return ApiResponse.Ok(new AuthResponse(accessToken, refreshToken, user.Email ?? string.Empty, user.DisplayName, roles));
    }

    [HttpPost]
    public async Task<ApiResponse<AuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken ct) {
        var existing = await userManager.FindByNameAsync(request.DisplayName);
        if (existing is not null) {
            return ApiResponse.Fail<AuthResponse>("Username already taken.");
        }

        var existingEmail = await userManager.FindByEmailAsync(request.Email);
        if (existingEmail is not null) {
            return ApiResponse.Fail<AuthResponse>("Email already registered.");
        }

        var user = new AppUser {
            UserName = request.DisplayName,
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
        var accessToken = jwtService.GenerateAccessToken(user, roles);
        var refreshToken = jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await userManager.UpdateAsync(user);

        return ApiResponse.Ok(new AuthResponse(accessToken, refreshToken, user.Email ?? string.Empty, user.DisplayName, roles));
    }

    [HttpPost]
    public async Task<ApiResponse<AuthResponse>> Refresh([FromBody] RefreshRequest request, CancellationToken ct) {
        if (string.IsNullOrWhiteSpace(request.RefreshToken)) {
            return ApiResponse.Fail<AuthResponse>("Invalid refresh token.");
        }

        var users = userManager.Users.Where(u => u.RefreshToken == request.RefreshToken).ToList();
        var user = users.FirstOrDefault(u => u.RefreshTokenExpiryTime > DateTime.UtcNow);

        if (user is null) {
            return ApiResponse.Fail<AuthResponse>("Invalid or expired refresh token.");
        }

        var roles = await userManager.GetRolesAsync(user);
        var accessToken = jwtService.GenerateAccessToken(user, roles);
        var newRefreshToken = jwtService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await userManager.UpdateAsync(user);

        return ApiResponse.Ok(new AuthResponse(accessToken, newRefreshToken, user.Email ?? string.Empty, user.DisplayName, roles));
    }
}
