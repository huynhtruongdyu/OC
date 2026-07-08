namespace OC.Bootstrapper.API.DTOs.Auth;

public sealed record AuthResponse(
    string Token,
    string RefreshToken,
    string Email,
    string DisplayName,
    IReadOnlyList<string> Roles,
    IReadOnlyList<string> Permissions,
    string Username
);
