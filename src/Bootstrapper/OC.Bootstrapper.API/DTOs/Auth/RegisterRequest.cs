namespace OC.Bootstrapper.API.DTOs.Auth;

public sealed record RegisterRequest(string DisplayName, string Email, string Password);
