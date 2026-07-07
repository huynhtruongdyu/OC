namespace OC.Bootstrapper.API.DTOs.Auth;

public sealed record AuthResponse(
    string Token,
    string Email,
    string DisplayName,
    IList<string> Roles
);
