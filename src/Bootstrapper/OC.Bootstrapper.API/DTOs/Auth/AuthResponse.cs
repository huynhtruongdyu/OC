namespace OC.Bootstrapper.API.DTOs.Auth;

public sealed record AuthResponse(
    string Token,
    string RefreshToken,
    string Email,
    string DisplayName,
    IList<string> Roles
);
